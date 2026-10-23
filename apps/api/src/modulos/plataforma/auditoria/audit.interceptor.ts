import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { UsuarioJwtPayload } from '@circadiano/contracts';
import type { Request } from 'express';
import { concatMap, type Observable } from 'rxjs';
import { PrismaService } from '../../../prisma/prisma.service';
import type { SolicitudAutenticada } from '../auth/usuario-actual.decorator';
import { AUDITABLE, type OpcionesAuditoria } from './auditable.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    const opciones = this.reflector.get<OpcionesAuditoria | undefined>(
      AUDITABLE,
      contexto.getHandler(),
    );
    const solicitud = contexto.switchToHttp().getRequest<Request & SolicitudAutenticada>();
    if (!opciones || (opciones.aplica && !opciones.aplica(solicitud))) {
      return siguiente.handle();
    }

    return siguiente.handle().pipe(
      concatMap(async (respuesta: unknown) => {
        await this.registrar(opciones.accion, solicitud, respuesta);
        return respuesta;
      }),
    );
  }

  private async registrar(accion: string, solicitud: Request & SolicitudAutenticada, respuesta: unknown) {
    try {
      await this.prisma.auditLog.create({
        data: {
          idUsuario: solicitud.usuario?.sub ?? this.usuarioDeTokens(respuesta),
          accion,
          // Sin query string: solo metodo y ruta con sus ids, nunca datos del cuerpo.
          recurso: `${solicitud.method} ${solicitud.originalUrl.split('?')[0]}`.slice(0, 255),
          ip: solicitud.ip?.slice(0, 45) ?? null,
        },
      });
    } catch {
      // La accion ya ocurrio: no se revierte la respuesta, solo se avisa (sin datos personales).
      this.logger.warn(`No se pudo registrar la auditoria de "${accion}"`);
    }
  }

  /** En el login aun no hay usuario en la solicitud: se toma del token emitido. */
  private usuarioDeTokens(respuesta: unknown): string | null {
    const token = (respuesta as { accessToken?: unknown } | undefined)?.accessToken;
    if (typeof token !== 'string') return null;
    return this.jwt.decode<UsuarioJwtPayload | null>(token)?.sub ?? null;
  }
}
