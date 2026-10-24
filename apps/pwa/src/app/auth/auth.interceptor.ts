import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import type { AuthTokens } from '@circadiano/contracts';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { SesionService } from './sesion.service';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro', '/auth/refresh', '/areas'];

/** Solo la API propia recibe el token (URL relativa o con apiUrl), nunca un tercero. */
function esDeLaApi(url: string): boolean {
  const base = environment.apiUrl;
  const esRelativa = url.startsWith('/') && !url.startsWith('//');
  return esRelativa || (base !== '' && url.startsWith(`${base}/`));
}

function esPublica(url: string): boolean {
  const ruta = url.replace(environment.apiUrl, '').split('?')[0];
  return RUTAS_PUBLICAS.includes(ruta);
}

function conToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

// Una sola renovacion a la vez: las peticiones que fallan juntas esperan el mismo resultado.
let renovacion: Observable<AuthTokens> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!esDeLaApi(req.url) || esPublica(req.url)) return next(req);

  const sesion = inject(SesionService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = sesion.accessToken();
  const peticion = token ? conToken(req, token) : req;

  return next(peticion).pipe(
    catchError((error: unknown) => {
      const refresco = sesion.refreshToken();
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || !refresco) {
        return throwError(() => error);
      }
      renovacion ??= auth.refrescar(refresco).pipe(
        shareReplay(1),
        finalize(() => (renovacion = null)),
      );
      return renovacion.pipe(
        switchMap((tokens) => next(conToken(req, tokens.accessToken))),
        catchError((fallo: unknown) => {
          // Si la renovacion falla (o el reintento sigue en 401) la sesion ya no sirve.
          if (fallo instanceof HttpErrorResponse && fallo.status === 401) {
            sesion.cerrar();
            void router.navigate(['/ingresar']);
          }
          return throwError(() => fallo);
        }),
      );
    }),
  );
};
