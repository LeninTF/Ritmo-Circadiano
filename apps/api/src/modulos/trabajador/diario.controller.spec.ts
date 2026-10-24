import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { DiarioController } from './diario.controller';
import { DiarioService } from './diario.service';

describe('DiarioController con guards reales (RNF04)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const diario = {
    upsertDiario: jest.fn().mockResolvedValue({}),
    consultarDiarios: jest.fn().mockResolvedValue([]),
  };
  const dto = {
    clientId: '123e4567-e89b-12d3-a456-426614174000',
    horaAcostarse: '2026-10-20T22:00:00Z',
    horaDespertar: '2026-10-21T06:00:00Z',
    latenciaMin: 10,
    despertares: 0,
    calidadPercibida: 5,
    fatigaPercibida: 1,
    esDiaLaboral: true,
    luzMatutinaMin: 30,
  };
  const token = (rol: string) =>
    jwt.signAsync({ sub: 'yo', rol, codigoParticipante: 'P01' }).then((t) => `Bearer ${t}`);

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [DiarioController],
      providers: [
        { provide: DiarioService, useValue: diario },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
    jwt = app.get(JwtService);
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('sin token responde 401 y no toca el servicio', async () => {
    const http = request(app.getHttpServer());
    await http.put('/diario/2026-10-21').send(dto).expect(401);
    await http.get('/diario?desde=2026-10-01&hasta=2026-10-21').expect(401);
    expect(diario.upsertDiario).not.toHaveBeenCalled();
    expect(diario.consultarDiarios).not.toHaveBeenCalled();
  });

  it('un rol distinto de trabajador recibe 403', async () => {
    const autorizacion = await token('despachador');
    await request(app.getHttpServer())
      .get('/diario?desde=2026-10-01&hasta=2026-10-21')
      .set('Authorization', autorizacion)
      .expect(403);
  });

  it('usa el sub del token e ignora x-usuario-id', async () => {
    const autorizacion = await token('trabajador');
    const http = request(app.getHttpServer());
    await http
      .put('/diario/2026-10-21')
      .set('Authorization', autorizacion)
      .set('x-usuario-id', 'otro')
      .send(dto)
      .expect(200);
    await http
      .get('/diario?desde=2026-10-01&hasta=2026-10-21')
      .set('Authorization', autorizacion)
      .set('x-usuario-id', 'otro')
      .expect(200);
    expect(diario.upsertDiario).toHaveBeenCalledWith('yo', '2026-10-21', dto);
    expect(diario.consultarDiarios).toHaveBeenCalledWith('yo', '2026-10-01', '2026-10-21');
  });
});
