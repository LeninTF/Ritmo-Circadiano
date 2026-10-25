import { randomBytes } from 'node:crypto';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { DiskHealthIndicator, MemoryHealthIndicator, TerminusModule } from '@nestjs/terminus';
import request from 'supertest';
import type { Rol, UsuarioJwtPayload } from '@circadiano/contracts';
import { PrismaHealthIndicator } from '../../../salud/prisma.health';
import { SaludController } from '../../../salud/salud.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UsuarioActual } from './usuario-actual.decorator';

// Generados en ejecución: un literal de alta entropía dispara el escáner de secretos.
const SECRETO = randomBytes(32).toString('hex');

@Controller('prueba')
class PruebaController {
  @Roles('jefe_operaciones')
  @Get('jefe')
  soloJefe(@UsuarioActual() u: UsuarioJwtPayload) {
    return { rol: u.rol };
  }
}

describe('Guards globales (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  const token = (rol: Rol, expiresIn = 60) =>
    jwt.signAsync(
      { sub: 'u1', rol, codigoParticipante: 'P01' } satisfies UsuarioJwtPayload,
      { expiresIn },
    );

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: SECRETO }), TerminusModule],
      controllers: [PruebaController, SaludController],
      providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        {
          provide: PrismaHealthIndicator,
          useValue: { comprobar: (k: string) => ({ [k]: { status: 'up' } }) },
        },
        // El heap y el disco del runner de CI varian: el test solo verifica que /health sea publica.
        { provide: MemoryHealthIndicator, useValue: { checkHeap: (k: string) => ({ [k]: { status: 'up' } }) } },
        { provide: DiskHealthIndicator, useValue: { checkStorage: (k: string) => ({ [k]: { status: 'up' } }) } },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
    jwt = app.get(JwtService);
  });

  afterAll(() => app.close());

  it('sin token -> 401', async () => {
    const res = await request(app.getHttpServer()).get('/prueba/jefe');
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'no_autenticado' });
  });

  it('token vencido -> 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/prueba/jefe')
      .set('Authorization', `Bearer ${await token('jefe_operaciones', -10)}`);
    expect(res.status).toBe(401);
  });

  it('token con firma ajena -> 401', async () => {
    const ajeno = await new JwtService({ secret: randomBytes(32).toString('hex') }).signAsync({
      sub: 'u1',
      rol: 'jefe_operaciones',
    });
    const res = await request(app.getHttpServer())
      .get('/prueba/jefe')
      .set('Authorization', `Bearer ${ajeno}`);
    expect(res.status).toBe(401);
  });

  it('rol incorrecto -> 403', async () => {
    const res = await request(app.getHttpServer())
      .get('/prueba/jefe')
      .set('Authorization', `Bearer ${await token('trabajador')}`);
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'prohibido' });
  });

  it('rol correcto -> 200 con el payload', async () => {
    const res = await request(app.getHttpServer())
      .get('/prueba/jefe')
      .set('Authorization', `Bearer ${await token('jefe_operaciones')}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ rol: 'jefe_operaciones' });
  });

  it('/health sigue publico', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
  });
});
