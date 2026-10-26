import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PushService {
  private readonly swPush = inject(SwPush);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  readonly suscrito = signal(false);

  constructor() {
    if (this.esNavegador) {
      this.initNotificationClicks();
    }
  }

  private initNotificationClicks(): void {
    if (!this.swPush.isEnabled) return;
    this.swPush.notificationClicks.subscribe(async (event) => {
      const notifId = event.notification?.data?.id_notificacion;
      if (notifId) {
        try {
          await firstValueFrom(
            this.http.patch(`${environment.apiUrl}/notificaciones/${notifId}/abierta`, {})
          );
        } catch {
          // Ignore network errors when marking open offline/retry
        }
      }
      void this.router.navigate(['/plan']);
    });
  }

  /**
   * Solicita suscripción Web Push respetando la guía de iOS (RNF06).
   * En iOS (Safari), si la PWA no está en modo standalone, muestra guía en lugar de pedir permiso directamente.
   */
  async solicitarSuscripcion(): Promise<boolean> {
    if (!this.esNavegador || !this.swPush.isEnabled) return false;

    const nav = navigator as Navigator & { standalone?: boolean };
    const isIOS = /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
    const matchMedia = typeof window.matchMedia === 'function' ? window.matchMedia('(display-mode: standalone)') : { matches: false };
    const isStandalone = matchMedia.matches || nav.standalone === true;

    if (isIOS && !isStandalone) {
      window.alert('Para recibir recordatorios circadianos en iOS: toca "Compartir" y selecciona "Agregar a pantalla de inicio".');
      return false;
    }

    try {
      let publicKey = environment.vapidPublicKey;
      try {
        const res = await firstValueFrom(
          this.http.get<{ clavePublica: string }>(`${environment.apiUrl}/push/clave-publica`)
        );
        if (res?.clavePublica) {
          publicKey = res.clavePublica;
        }
      } catch {
        // Fallback to environment vapidPublicKey if backend request fails
      }

      const sub = await this.swPush.requestSubscription({
        serverPublicKey: publicKey,
      });
      const json = sub.toJSON();
      if (!json.endpoint || !json.keys?.['p256dh'] || !json.keys?.['auth']) {
        return false;
      }
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/push/suscripciones`, {
          endpoint: json.endpoint,
          clave_p256dh: json.keys['p256dh'],
          clave_auth: json.keys['auth'],
        })
      );
      this.suscrito.set(true);
      return true;
    } catch {
      return false;
    }
  }
}
