import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Resultado de pedir push: la pantalla decide qué mostrar (p. ej. la guía de iOS). */
export type ResultadoSuscripcion = 'suscrito' | 'ios-sin-instalar' | 'no-disponible' | 'error';

/** Pantalla que abre cada tipo de recordatorio; el resto va al plan. */
const RUTA_POR_TIPO: Record<string, string> = { corte_cafeina: '/cafeina' };

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
      const datos = event.notification?.data as { id_notificacion?: number; tipo?: string } | undefined;
      if (datos?.id_notificacion) {
        try {
          await firstValueFrom(
            this.http.patch(`${environment.apiUrl}/notificaciones/${datos.id_notificacion}/abierta`, {})
          );
        } catch {
          // Marcar como abierta es solo para el indicador: sin red no se bloquea la navegación.
        }
      }
      void this.router.navigate([RUTA_POR_TIPO[datos?.tipo ?? ''] ?? '/plan']);
    });
  }

  /**
   * Solicita suscripción Web Push (RNF06). En iOS sin instalar no pide permiso:
   * devuelve 'ios-sin-instalar' para que la pantalla muestre la guía de instalación.
   */
  async solicitarSuscripcion(): Promise<ResultadoSuscripcion> {
    if (!this.esNavegador || !this.swPush.isEnabled) return 'no-disponible';

    const nav = navigator as Navigator & { standalone?: boolean };
    const isIOS = /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
    const matchMedia = typeof window.matchMedia === 'function' ? window.matchMedia('(display-mode: standalone)') : { matches: false };
    const isStandalone = matchMedia.matches || nav.standalone === true;

    if (isIOS && !isStandalone) return 'ios-sin-instalar';

    try {
      // La clave sale siempre del servidor: una clave distinta a la que firma el API nunca entrega push.
      const { clavePublica } = await firstValueFrom(
        this.http.get<{ clavePublica: string }>(`${environment.apiUrl}/push/clave-publica`)
      );
      const sub = await this.swPush.requestSubscription({ serverPublicKey: clavePublica });
      const json = sub.toJSON();
      if (!json.endpoint || !json.keys?.['p256dh'] || !json.keys?.['auth']) {
        return 'error';
      }
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/push/suscripciones`, {
          endpoint: json.endpoint,
          clave_p256dh: json.keys['p256dh'],
          clave_auth: json.keys['auth'],
        })
      );
      this.suscrito.set(true);
      return 'suscrito';
    } catch {
      return 'error';
    }
  }
}
