import { randomBytes } from 'node:crypto';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { NotificacionesController } from '../notificaciones/notificaciones.controller';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { BebidasController } from './bebidas.controller';
import { CafeinaController } from './cafeina.controller';
import { CafeinaService } from './cafeina.service';

const UUID = '3f1c2b9e-8a4d-4c1e-9b7a-2d5e6f708192';

describe('Cafeina y push usan el usuario del token (RNF04)', () => {
  let app: INestApplication;
  let autorizacion: string;
  let autorizacionDespachador: string;
  const cafeina = {
    registrarIngesta: jest.fn().mockResolvedValue({}),
    listarIngestas: jest.fn().mockResolvedValue([]),
    eliminarIngesta: jest.fn().mockResolvedValue(undefined),
    calcularResidualHastaSueno: jest.fn().mockResolvedValue({}),
    obtenerResumen: jest.fn().mockResolvedValue({}),
    obtenerBebidas: jest.fn().mockResolvedValue([]),
  };
  const notificaciones = { guardarSuscripcion: jest.fn(), marcarAbierta: jest.fn().mockResolvedValue({}), obtenerClavePublica: jest.fn().mockResolvedValue({ clavePublica: 'test' }) };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [CafeinaController, BebidasController, NotificacionesController],
      providers: [
        { provide: CafeinaService, useValue: cafeina },
        { provide: NotificacionesService, useValue: notificaciones },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    const t = await app.get(JwtService).signAsync({ sub: 'yo', rol: 'trabajador', codigoParticipante: 'P01' });
    autorizacion = `Bearer ${t}`;
    const d = await app.get(JwtService).signAsync({ sub: 'otro', rol: 'despachador', codigoParticipante: 'P02' });
    autorizacionDespachador = `Bearer ${d}`;
  });

  afterAll(() => app.close());

  it('lecturas ignoran el id_usuario de la query', async () => {
    const http = request(app.getHttpServer());
    await http.get('/cafeina?id_usuario=otro&fecha=2026-10-23').set('Authorization', autorizacion);
    await http.get('/cafeina/residual?id_usuario=otro&hasta=23').set('Authorization', autorizacion);
    expect(cafeina.listarIngestas).toHaveBeenCalledWith('yo', '2026-10-23');
    expect(cafeina.calcularResidualHastaSueno).toHaveBeenCalledWith('yo', 23);
  });

  it('residual: hasta no numérico o ausente → 400 sin llegar al servicio (B4)', async () => {
    const http = request(app.getHttpServer());
    jest.clearAllMocks();
    await http.get('/cafeina/residual?hasta=abc').set('Authorization', autorizacion).expect(400);
    await http.get('/cafeina/residual').set('Authorization', autorizacion).expect(400);
    expect(cafeina.calcularResidualHastaSueno).not.toHaveBeenCalled();
  });

  it('escrituras reemplazan el id_usuario del cuerpo y el borrado exige ser dueno', async () => {
    const http = request(app.getHttpServer());
    const cuerpo = { id_bebida: 1, porciones: 2, fecha_hora: '2026-10-24T13:30:00.000Z', client_id: UUID };
    await http.post('/cafeina').set('Authorization', autorizacion).send(cuerpo).expect(201);
    // Un id_usuario en el cuerpo ni siquiera se acepta.
    await http.post('/cafeina').set('Authorization', autorizacion).send({ ...cuerpo, id_usuario: 'otro' }).expect(400);
    await http.delete('/cafeina/7').set('Authorization', autorizacion);
    await http
      .post('/push/suscripciones')
      .set('Authorization', autorizacion)
      .send({ endpoint: 'https://e', clave_p256dh: 'k', clave_auth: 'a' })
      .expect(201);
    // Igual que en /cafeina: un id_usuario en el cuerpo no se acepta.
    await http
      .post('/push/suscripciones')
      .set('Authorization', autorizacion)
      .send({ id_usuario: 'otro', endpoint: 'https://e', clave_p256dh: 'k', clave_auth: 'a' })
      .expect(400);
    await http.patch('/notificaciones/3/abierta').set('Authorization', autorizacion).expect(200);

    expect(cafeina.registrarIngesta.mock.calls[0][0].id_usuario).toBe('yo');
    expect(cafeina.eliminarIngesta).toHaveBeenCalledWith(7, 'yo');
    expect(notificaciones.guardarSuscripcion.mock.calls[0][0].id_usuario).toBe('yo');
    expect(notificaciones.marcarAbierta).toHaveBeenCalledWith(3, 'yo');
  });

  it('el resumen usa el usuario del token, 7 días por defecto y valida la query (RF09)', async () => {
    const http = request(app.getHttpServer());
    await http.get('/cafeina/resumen').set('Authorization', autorizacion).expect(200);
    await http.get('/cafeina/resumen?dias=14').set('Authorization', autorizacion).expect(200);
    expect(cafeina.obtenerResumen).toHaveBeenNthCalledWith(1, 'yo', 7);
    expect(cafeina.obtenerResumen).toHaveBeenNthCalledWith(2, 'yo', 14);

    await http.get('/cafeina/resumen?dias=0').set('Authorization', autorizacion).expect(400);
    await http.get('/cafeina/resumen?dias=31').set('Authorization', autorizacion).expect(400);
    await http.get('/cafeina/resumen?id_usuario=otro').set('Authorization', autorizacion).expect(400);
  });

  it('todas las rutas de cafeína y bebidas exigen token y rol trabajador (CLAUDE.md §6)', async () => {
    const http = request(app.getHttpServer());
    const cuerpo = { id_bebida: 1, fecha_hora: '2026-10-24T13:30:00.000Z', client_id: UUID };
    const rutas = [
      () => http.get('/cafeina/resumen'),
      () => http.get('/cafeina?fecha=2026-10-24'),
      () => http.get('/cafeina/residual?hasta=23'),
      () => http.post('/cafeina').send(cuerpo),
      () => http.delete('/cafeina/7'),
      () => http.get('/bebidas'),
    ];
    jest.clearAllMocks();
    for (const ruta of rutas) {
      await ruta().expect(401);
      await ruta().set('Authorization', autorizacionDespachador).expect(403);
    }
    expect(Object.values(cafeina).every((fn) => fn.mock.calls.length === 0)).toBe(true);

    await http.get('/bebidas').set('Authorization', autorizacion).expect(200);
  });

  it('las rutas de push viven en /push/* y /notificaciones/* y exigen rol trabajador (RF10, §6)', async () => {
    const http = request(app.getHttpServer());
    const rutas = [
      () => http.get('/push/clave-publica'),
      () => http.post('/push/suscripciones').send({ endpoint: 'https://e', clave_p256dh: 'k', clave_auth: 'a' }),
      () => http.patch('/notificaciones/3/abierta'),
    ];
    for (const ruta of rutas) {
      await ruta().expect(401);
      await ruta().set('Authorization', autorizacionDespachador).expect(403);
    }
    const res = await http.get('/push/clave-publica').set('Authorization', autorizacion).expect(200);
    expect(res.body).toEqual({ clavePublica: 'test' });
  });

  it('POST /cafeina valida el cuerpo antes de llegar al servicio (HU-03)', async () => {
    const http = request(app.getHttpServer());
    const base = { id_bebida: 1, fecha_hora: '2026-10-24T13:30:00.000Z', client_id: UUID };
    cafeina.registrarIngesta.mockClear();
    for (const malo of [
      { ...base, client_id: 'no-uuid' },
      { ...base, fecha_hora: 'ayer' },
      { ...base, porciones: 5 },
      { id_bebida: null, cafeina_mg: 0, fecha_hora: base.fecha_hora, client_id: UUID },
      { id_bebida: null, cafeina_mg: 1001, fecha_hora: base.fecha_hora, client_id: UUID },
    ]) {
      await http.post('/cafeina').set('Authorization', autorizacion).send(malo).expect(400);
    }
    expect(cafeina.registrarIngesta).not.toHaveBeenCalled();
  });
});
