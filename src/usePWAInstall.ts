import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt) {
      return window.__deferredPWAInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Only return true when opened inside the installed mobile app (never in the web browser tab)
    const checkStandalone = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      window.location.search.includes('app=srom-mobile');

    setIsInstalled(checkStandalone());

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      setIsInstalled(checkStandalone());
    };
    mediaQuery.addEventListener?.('change', handleDisplayModeChange);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const syncDeferredPrompt = () => {
      if (window.__deferredPWAInstallPrompt) {
        setDeferredPrompt(window.__deferredPWAInstallPrompt);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      window.__deferredPWAInstallPrompt = null;
      setDeferredPrompt(null);
      setIsInstalled(checkStandalone());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', syncDeferredPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener?.('change', handleDisplayModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', syncDeferredPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    let promptEvent = deferredPrompt || window.__deferredPWAInstallPrompt;

    // Wait briefly if Chrome is still completing the service worker installability check
    if (!promptEvent && typeof window !== 'undefined') {
      promptEvent = await new Promise<BeforeInstallPromptEvent | null>((resolve) => {
        let settled = false;
        const onPrompt = (e: Event) => {
          if ('preventDefault' in e) e.preventDefault();
          const pe = (window.__deferredPWAInstallPrompt || e) as BeforeInstallPromptEvent;
          if (pe && typeof pe.prompt === 'function') {
            window.__deferredPWAInstallPrompt = pe;
            setDeferredPrompt(pe);
            if (!settled) {
              settled = true;
              window.removeEventListener('beforeinstallprompt', onPrompt);
              window.removeEventListener('pwa-prompt-ready', onPrompt);
              resolve(pe);
            }
          }
        };
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('pwa-prompt-ready', onPrompt);
        setTimeout(() => {
          if (!settled) {
            settled = true;
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('pwa-prompt-ready', onPrompt);
            resolve(window.__deferredPWAInstallPrompt || null);
          }
        }, 1200);
      });
    }

    if (!promptEvent || typeof promptEvent.prompt !== 'function') return false;
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        window.__deferredPWAInstallPrompt = null;
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      // Prompt may have already been used
    }
    return false;
  };

  return {
    isInstallable: !!(deferredPrompt || (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt)),
    isInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
