import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import type { Rol } from '@circadiano/contracts';
import { SesionService } from './sesion.service';

/** Exige sesion; si no hay, lleva a /ingresar y recuerda a donde iba. */
export const autenticadoGuard: CanActivateFn = (_ruta, estado) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  return sesion.estaAutenticada()
    ? true
    : router.createUrlTree(['/ingresar'], {
        queryParams: { retorno: estado.url },
      });
};

/**
 * Exige sesion y uno de los roles. Es ayuda de interfaz: el servidor responde 403
 * si el rol no corresponde, aunque alguien salte este guard.
 */
export const rolGuard =
  (...permitidos: Rol[]): CanActivateFn =>
  (ruta, estado) => {
    const sesion = inject(SesionService);
    const router = inject(Router);
    const sinSesion = autenticadoGuard(ruta, estado);
    if (sinSesion !== true) return sinSesion;
    const rol = sesion.rol();
    return rol !== null && permitidos.includes(rol)
      ? true
      : router.createUrlTree(['/plataforma']);
  };
