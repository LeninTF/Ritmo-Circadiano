import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UsuarioJwtPayload } from '@circadiano/contracts';

export interface SolicitudAutenticada {
  headers: { authorization?: string };
  usuario?: UsuarioJwtPayload;
}

/** Payload del JWT del usuario autenticado. */
export const UsuarioActual = createParamDecorator(
  (_data: unknown, contexto: ExecutionContext): UsuarioJwtPayload | undefined =>
    contexto.switchToHttp().getRequest<SolicitudAutenticada>().usuario,
);
