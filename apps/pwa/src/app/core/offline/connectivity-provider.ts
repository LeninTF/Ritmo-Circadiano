import { InjectionToken } from '@angular/core';

export interface IConnectivityProvider {
  isOnline(): boolean;
  onOnline(listener: () => void): () => void;
}

export const CONNECTIVITY_PROVIDER_TOKEN =
  new InjectionToken<IConnectivityProvider>('CONNECTIVITY_PROVIDER_TOKEN', {
    providedIn: 'root',
    factory: (): IConnectivityProvider => ({
      isOnline: () => typeof navigator === 'undefined' || navigator.onLine,
      onOnline: (listener: () => void) => {
        if (typeof window === 'undefined') return () => undefined;
        window.addEventListener('online', listener);
        return () => window.removeEventListener('online', listener);
      },
    }),
  });
