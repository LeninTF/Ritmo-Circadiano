import { Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/** Recuerda en memoria que la persona leyo y acepto el consentimiento (RN11). */
@Injectable({ providedIn: 'root' })
export class FlujoRegistroService {
  readonly consentimientoAceptado = signal(false);
}

/** Sin consentimiento aceptado no se llega al formulario de registro. */
export const consentimientoGuard: CanActivateFn = () =>
  inject(FlujoRegistroService).consentimientoAceptado()
    ? true
    : inject(Router).createUrlTree(['/consentimiento']);
