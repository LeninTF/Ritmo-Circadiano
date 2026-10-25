import { randomBytes, randomUUID } from 'node:crypto';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Rol } from '@circadiano/contracts';
import { JwtAuthGuard, RolesGuard } from '../../plataforma/auth';
import { AptitudController } from '../aptitud.controller';
import { AptitudService } from '../aptitud.service';

describe('AptitudController con guards reales (RNF04, RN10)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const aptitud = {
    crearAptitud: jest.fn().mockResolvedValue({ color: 'verde' }),
    consultarDespacho: jest.fn().mockResolvedValue({ evaluaciones: [] }),
  };
  const token = (rol: Rol) =>
    jwt.signAsync({ sub: 'yo', rol, codigoParticipante: 'P01' }).then((t) => `Bearer ${t}`);
  const idTurno = randomUUID();

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [AptitudController],
      providers: [
        { provide: AptitudService, useValue: aptitud },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    // Igual que main.ts.
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    jwt = app.get(JwtService);
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('POST /aptitud/:idTurno: 401 sin token, 403 si no es trabajador; usa el sub del token', async () => {
    const http = request(app.getHttpServer());
    await http.post(`/aptitud/${idTurno}`).send({ somnolencia: 2 }).expect(401);
    await http.post(`/aptitud/${idTurno}`).set('Authorization', await token('despachador')).send({ somnolencia: 2 }).expect(403);

    const res = await http
      .post(`/aptitud/${idTurno}`)
      .set('Authorization', await token('trabajador'))
      .set('x-usuario-id', 'otro')
      .send({ somnolencia: 2, compartido: true })
      .expect(201);
    expect(res.body).toEqual({ color: 'verde' });
    expect(aptitud.crearAptitud).toHaveBeenCalledWith('yo', idTurno, { somnolencia: 2, compartido: true });
  });

  it.each([
    ['somnolencia fuera de rango', idTurno, { somnolencia: 6 }],
    ['campo extra (idUsuario)', idTurno, { somnolencia: 2, idUsuario: 'otro' }],
    ['id de turno no UUID', 'turno-1', { somnolencia: 2 }],
  ])('POST con %s → 400', async (_caso, id, cuerpo) => {
    await request(app.getHttpServer())
      .post(`/aptitud/${id}`)
      .set('Authorization', await token('trabajador'))
      .send(cuerpo)
      .expect(400);
    expect(aptitud.crearAptitud).not.toHaveBeenCalled();
  });

  it('GET /aptitud/despacho solo para despachador', async () => {
    const http = request(app.getHttpServer());
    const url = '/aptitud/despacho?codigo=P01&fecha=2026-10-24';
    await http.get(url).expect(401);
    for (const rol of ['trabajador', 'jefe_operaciones', 'administrador'] as Rol[]) {
      await http.get(url).set('Authorization', await token(rol)).expect(403);
    }
    await http.get(url).set('Authorization', await token('despachador')).expect(200);
    expect(aptitud.consultarDespacho).toHaveBeenCalledWith('P01', '2026-10-24');
  });
});
