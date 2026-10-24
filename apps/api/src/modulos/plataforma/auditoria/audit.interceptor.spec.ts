import { randomBytes } from 'node:crypto';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom, of, throwError } from 'rxjs';
import type { PrismaService } from '../../../prisma/prisma.service';
import { AuditInterceptor } from './audit.interceptor';
import { Auditable } from './auditable.decorator';

class Rutas {
  @Auditable('login')
  login() {
    return null;
  }

  @Auditable('turno_forzado', (s) => s.body?.confirmarExceso === true)
  turno() {
    return null;
  }

  libre() {
    return null;
  }
}

describe('AuditInterceptor', () => {
  const jwt = new JwtService({ secret: randomBytes(32).toString('hex') });
  const crear = jest.fn().mockResolvedValue({});
  const prisma = { auditLog: { create: crear } } as unknown as PrismaService;
  const interceptor = new AuditInterceptor(new Reflector(), prisma, jwt);

  const contexto = (handler: () => void, solicitud: object) =>
    ({
      getHandler: () => handler,
      switchToHttp: () => ({ getRequest: () => solicitud }),
    }) as unknown as ExecutionContext;
  const solicitud = (extra: object = {}) => ({
    method: 'POST',
    originalUrl: '/operaciones/turnos?correo=x@y.pe',
    ip: '10.0.0.1',
    ...extra,
  });
  const responde = (valor: unknown): CallHandler => ({ handle: () => of(valor) });

  beforeEach(() => crear.mockClear());

  it('registra el usuario autenticado, la ruta sin query y la ip', async () => {
    const r = solicitud({ usuario: { sub: 'u1' }, body: { confirmarExceso: true } });
    await lastValueFrom(interceptor.intercept(contexto(Rutas.prototype.turno, r), responde({ id: 't1' })));
    expect(crear).toHaveBeenCalledWith({
      data: { idUsuario: 'u1', accion: 'turno_forzado', recurso: 'POST /operaciones/turnos', ip: '10.0.0.1' },
    });
  });

  it('en el login toma el usuario del token emitido', async () => {
    const accessToken = await jwt.signAsync({ sub: 'u2' });
    await lastValueFrom(interceptor.intercept(contexto(Rutas.prototype.login, solicitud()), responde({ accessToken })));
    expect(crear.mock.calls[0][0].data.idUsuario).toBe('u2');
  });

  it('no audita si la condicion no aplica, si no hay decorador o si la ruta falla', async () => {
    await lastValueFrom(
      interceptor.intercept(contexto(Rutas.prototype.turno, solicitud({ body: {} })), responde({})),
    );
    await lastValueFrom(interceptor.intercept(contexto(Rutas.prototype.libre, solicitud()), responde({})));
    await expect(
      lastValueFrom(
        interceptor.intercept(contexto(Rutas.prototype.login, solicitud()), {
          handle: () => throwError(() => new Error('401')),
        }),
      ),
    ).rejects.toThrow('401');
    expect(crear).not.toHaveBeenCalled();
  });

  it('si falla la escritura devuelve igual la respuesta', async () => {
    crear.mockRejectedValueOnce(new Error('bd caida'));
    const valor = await lastValueFrom(
      interceptor.intercept(contexto(Rutas.prototype.login, solicitud()), responde({ ok: true })),
    );
    expect(valor).toEqual({ ok: true });
  });
});
