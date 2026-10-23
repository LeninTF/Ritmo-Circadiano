import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CODIGOS_ERROR, type Rol } from '@circadiano/contracts';
import { ES_PUBLICA } from './publica.decorator';
import { ROLES_PERMITIDOS } from './roles.decorator';
import type { SolicitudAutenticada } from './usuario-actual.decorator';

/** Va despues de JwtAuthGuard. Sin @Roles basta con estar autenticado. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const destinos = [contexto.getHandler(), contexto.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(ES_PUBLICA, destinos)) {
      return true;
    }
    const permitidos = this.reflector.getAllAndOverride<Rol[] | undefined>(
      ROLES_PERMITIDOS,
      destinos,
    );
    if (!permitidos?.length) return true;

    const rol = contexto.switchToHttp().getRequest<SolicitudAutenticada>()
      .usuario?.rol;
    if (rol && permitidos.includes(rol)) return true;
    throw new ForbiddenException({
      code: CODIGOS_ERROR.PROHIBIDO,
      message: 'Tu rol no tiene acceso a esta funcion',
    });
  }
}
