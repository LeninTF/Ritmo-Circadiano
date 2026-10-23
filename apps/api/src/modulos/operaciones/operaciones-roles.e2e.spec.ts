import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Rol } from '@circadiano/contracts';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { IndicadoresController } from '../indicadores/indicadores.controller';
import { IndicadoresService } from '../indicadores/indicadores.service';
import { OperacionesController } from './operaciones.controller';
import { OperacionesService } from './operaciones.service';

describe('Roles en operaciones e indicadores (RNF04)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const operaciones = { listarTurnos: jest.fn().mockResolvedValue([]), listarTurnosMe: jest.fn().mockResolvedValue([]) };
  const indicadores = { obtenerPanel: jest.fn().mockResolvedValue({ suficiente: false }) };
  const token = (rol: Rol, sub = 'u1') =>
    jwt.signAsync({ sub, rol, codigoParticipante: 'P01' }).then((t) => `Bearer ${t}`);

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [OperacionesController, IndicadoresController],
      providers: [
        { provide: OperacionesService, useValue: operaciones },
        { provide: IndicadoresService, useValue: indicadores },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
    jwt = app.get(JwtService);
  });

  afterAll(() => app.close());

  it('un trabajador no lista turnos ajenos (403); el jefe si', async () => {
    const http = request(app.getHttpServer());
    expect((await http.get('/operaciones/turnos?idUsuario=otro').set('Authorization', await token('trabajador'))).status).toBe(403);
    expect((await http.get('/operaciones/turnos').set('Authorization', await token('jefe_operaciones'))).status).toBe(200);
  });

  it('/turnos/me usa el usuario del token e ignora idUsuario y x-usuario-id', async () => {
    await request(app.getHttpServer())
      .get('/operaciones/turnos/me?idUsuario=otro')
      .set('x-usuario-id', 'otro')
      .set('Authorization', await token('trabajador', 'yo'));
    expect(operaciones.listarTurnosMe).toHaveBeenCalledWith('yo', undefined, undefined);
  });

  it('el panel de indicadores responde al jefe y niega al trabajador', async () => {
    const http = request(app.getHttpServer());
    expect((await http.get('/indicadores/panel').set('Authorization', await token('jefe_operaciones'))).status).toBe(200);
    expect((await http.get('/indicadores/panel').set('Authorization', await token('trabajador'))).status).toBe(403);
  });
});
