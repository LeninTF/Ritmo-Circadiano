import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OfflineStoreService {
  readonly isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  setItem(key: string, value: any): void {
    try {
      const payload = {
        data: value,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`circadiano_offline_${key}`, JSON.stringify(payload));
    } catch (err) {
      console.error('Error saving to OfflineStore:', err);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`circadiano_offline_${key}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.data as T;
    } catch (err) {
      console.error('Error reading from OfflineStore:', err);
      return null;
    }
  }
}
