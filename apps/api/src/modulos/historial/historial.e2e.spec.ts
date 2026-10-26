import { randomBytes } from 'node:crypto';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';
import { DiarioService } from '../trabajador/diario.service';
import { CafeinaService } from '../cafeina/cafeina.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

 describe('RF15 GET /historial/me con guards auténticos', () => {
  let app: INestApplication;
  let trabajador: string;
  let despachador: string;
  const consultarDiarios = jest.fn().mockResolvedValue([]);
  const findMany = jest.fn().mockResolvedValue([]);
  const count = jest.fn().mockResolvedValue([]);

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [HistorialController],
      providers: [
        HistorialService,
        { provide: DiarioService, useValue: { consultarDiarios } },
        { provide: CafeinaService, useValue: { consultarIngestasEnRango: findMany } },
        { provide: NotificacionesService, useValue: { consultarAbiertasEnRango: count } },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    const jwt = app.get(JwtService);
    trabajador = `Bearer ${await jwt.signAsync({ sub: 'yo', rol: 'trabajador', codigoParticipante: 'P01' })}`;
    despachador = `Bearer ${await jwt.signAsync({ sub: 'otro', rol: 'despachador', codigoParticipante: 'P02' })}`;
  });
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('sin JWT devuelve 401 sin consultar datos', async () => {
    await request(app.getHttpServer()).get('/historial/me?dias=7').expect(401);
    expect(consultarDiarios).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  it('un autenticado sin rol trabajador recibe 403 sin consultar datos', async () => {
    await request(app.getHttpServer()).get('/historial/me?dias=7').set('Authorization', despachador).expect(403);
    expect(consultarDiarios).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  it.each([7, 14, 30])('un trabajador puede consultar dias=%s', async (dias) => {
    const respuesta = await request(app.getHttpServer()).get(`/historial/me?dias=${dias}`)
      .set('Authorization', trabajador).expect(200);
    expect(respuesta.body.dias).toHaveLength(dias);
    expect(consultarDiarios).toHaveBeenCalledWith('yo', expect.any(String), expect.any(String));
  });

  it('usa usuario.sub en todas las consultas', async () => {
    await request(app.getHttpServer())
      .get('/historial/me?dias=7')
      .set('Authorization', trabajador).expect(200);
    expect(consultarDiarios).toHaveBeenCalledWith('yo', expect.any(String), expect.any(String));
    expect(findMany).not.toHaveBeenCalled();
    expect(count).toHaveBeenCalledTimes(1);
    expect(count).toHaveBeenCalledWith('yo', expect.any(Date), expect.any(Date));
  });

  it('transforma 07 a 7 mediante el DTO', async () => {
    const respuesta = await request(app.getHttpServer()).get('/historial/me?dias=07')
      .set('Authorization', trabajador).expect(200);
    expect(respuesta.body.dias).toHaveLength(7);
  });

  it('rechaza identidades arbitrarias mediante el ValidationPipe de producción', async () => {
    await request(app.getHttpServer()).get('/historial/me?dias=7&id_usuario=ajeno')
      .set('Authorization', trabajador).expect(400);
    expect(consultarDiarios).not.toHaveBeenCalled();
  });

  it.each(['7abc', '7.5', '', '0', '8', '31'])('dias=%s devuelve 400 sin consultar datos', async (dias) => {
    const query = dias === '' ? '' : `?dias=${dias}`;
    await request(app.getHttpServer()).get(`/historial/me${query}`)
      .set('Authorization', trabajador).expect(400);
    expect(consultarDiarios).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });
});
