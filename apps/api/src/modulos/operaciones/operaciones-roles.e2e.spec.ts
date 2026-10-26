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
  const operaciones = {
    listarTurnos: jest.fn().mockResolvedValue([]),
    listarTurnosMe: jest.fn().mockResolvedValue([]),
    confirmarTurno: jest.fn().mockResolvedValue({}),
    crearTurno: jest.fn().mockResolvedValue({ id: 't-new' }),
    actualizarTurno: jest.fn().mockResolvedValue({ id: 't-1' }),
  };
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

  it('confirmar turno (RF05): 401 sin token, 403 para no trabajador, y el dueño sale del token', async () => {
    const http = request(app.getHttpServer());
    const cuerpo = { estadoConfirmacion: 'confirmado' };
    expect((await http.patch('/operaciones/turnos/t-1/confirmacion').send(cuerpo)).status).toBe(401);
    expect(
      (await http.patch('/operaciones/turnos/t-1/confirmacion').set('Authorization', await token('despachador')).send(cuerpo)).status,
    ).toBe(403);
    expect(operaciones.confirmarTurno).not.toHaveBeenCalled();

    await http
      .patch('/operaciones/turnos/t-1/confirmacion')
      .set('x-usuario-id', 'otro')
      .set('Authorization', await token('trabajador', 'yo'))
      .send(cuerpo)
      .expect(200);
    expect(operaciones.confirmarTurno).toHaveBeenCalledWith('t-1', 'yo', cuerpo);
  });

  it('el panel de indicadores responde al jefe y niega al trabajador', async () => {
    const http = request(app.getHttpServer());
    expect((await http.get('/indicadores/panel').set('Authorization', await token('jefe_operaciones'))).status).toBe(200);
    expect((await http.get('/indicadores/panel').set('Authorization', await token('trabajador'))).status).toBe(403);
  });

  it('401 Unauthorized al consumir /operaciones/turnos sin token o con token inválido', async () => {
    const http = request(app.getHttpServer());
    expect((await http.get('/operaciones/turnos')).status).toBe(401);
    expect((await http.get('/operaciones/turnos').set('Authorization', 'Bearer token_invalido_123')).status).toBe(401);
  });

  it('403 Forbidden al consumir /operaciones/turnos con rol no permitido (trabajador)', async () => {
    const http = request(app.getHttpServer());
    const res = await http.get('/operaciones/turnos').set('Authorization', await token('trabajador'));
    expect(res.status).toBe(403);
  });

  it('permite crear turno aplicando el flag ?forzar=true con rol autorizado', async () => {
    const http = request(app.getHttpServer());
    const dto = {
      idUsuario: '123e4567-e89b-12d3-a456-426614174000',
      idRuta: '123e4567-e89b-12d3-a456-426614174001',
      fecha: '2026-10-25',
      inicioProgramado: '2026-10-25T08:00:00Z',
      finProgramado: '2026-10-25T16:00:00Z',
      horasConduccion: 8,
    };
    const res = await http
      .post('/operaciones/turnos?forzar=true')
      .set('Authorization', await token('jefe_operaciones'))
      .send(dto);
    expect(res.status).toBe(201);
    expect(operaciones.crearTurno).toHaveBeenCalledWith(expect.objectContaining({ confirmarExceso: true }));
    // El motivo lo exige el servicio (RF14): el controller no lo inventa.
    expect(operaciones.crearTurno.mock.calls[0][0]).not.toHaveProperty('motivoExceso');
  });
});
