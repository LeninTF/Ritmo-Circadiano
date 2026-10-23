import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CODIGOS_ERROR, type UsuarioJwtPayload } from '@circadiano/contracts';
import { ES_PUBLICA } from './publica.decorator';
import type { SolicitudAutenticada } from './usuario-actual.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const esPublica = this.reflector.getAllAndOverride<boolean>(ES_PUBLICA, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (esPublica) return true;

    const solicitud = contexto.switchToHttp().getRequest<SolicitudAutenticada>();
    const [esquema, token] = (solicitud.headers.authorization ?? '').split(' ');
    if (esquema !== 'Bearer' || !token) throw this.noAutenticado();

    try {
      solicitud.usuario = await this.jwt.verifyAsync<UsuarioJwtPayload>(token, {
        algorithms: ['HS256'],
      });
    } catch {
      throw this.noAutenticado();
    }
    return true;
  }

  private noAutenticado(): UnauthorizedException {
    return new UnauthorizedException({
      code: CODIGOS_ERROR.NO_AUTENTICADO,
      message: 'Token ausente, invalido o vencido',
    });
  }
}
