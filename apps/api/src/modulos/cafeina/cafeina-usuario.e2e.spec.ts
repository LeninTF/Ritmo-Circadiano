import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { NotificacionesController } from '../notificaciones/notificaciones.controller';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { CafeinaController } from './cafeina.controller';
import { CafeinaService } from './cafeina.service';

describe('Cafeina y push usan el usuario del token (RNF04)', () => {
  let app: INestApplication;
  let autorizacion: string;
  const cafeina = {
    registrarIngesta: jest.fn().mockResolvedValue({}),
    listarIngestas: jest.fn().mockResolvedValue([]),
    eliminarIngesta: jest.fn().mockResolvedValue(undefined),
    calcularResidualHastaSueno: jest.fn().mockResolvedValue({}),
    sincronizarLote: jest.fn().mockResolvedValue([]),
  };
  const notificaciones = { guardarSuscripcion: jest.fn(), marcarAbierta: jest.fn().mockResolvedValue({}) };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [CafeinaController, NotificacionesController],
      providers: [
        { provide: CafeinaService, useValue: cafeina },
        { provide: NotificacionesService, useValue: notificaciones },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
    const t = await app.get(JwtService).signAsync({ sub: 'yo', rol: 'trabajador', codigoParticipante: 'P01' });
    autorizacion = `Bearer ${t}`;
  });

  afterAll(() => app.close());

  it('lecturas ignoran el id_usuario de la query', async () => {
    const http = request(app.getHttpServer());
    await http.get('/cafeina?id_usuario=otro&fecha=2026-10-23').set('Authorization', autorizacion);
    await http.get('/cafeina/residual?id_usuario=otro&hasta=23').set('Authorization', autorizacion);
    expect(cafeina.listarIngestas).toHaveBeenCalledWith('yo', '2026-10-23');
    expect(cafeina.calcularResidualHastaSueno).toHaveBeenCalledWith('yo', 23);
  });

  it('escrituras reemplazan el id_usuario del cuerpo y el borrado exige ser dueno', async () => {
    const http = request(app.getHttpServer());
    await http.post('/cafeina').set('Authorization', autorizacion).send({ id_usuario: 'otro', client_id: 'c1', fecha_hora: 'x' });
    await http.post('/cafeina/sync/lote').set('Authorization', autorizacion).send([{ id_usuario: 'otro', client_id: 'c2' }]);
    await http.delete('/cafeina/7').set('Authorization', autorizacion);
    await http
      .post('/push/suscripciones')
      .set('Authorization', autorizacion)
      .send({ id_usuario: 'usr_default', endpoint: 'https://e', clave_p256dh: 'k', clave_auth: 'a' });
    await http.patch('/notificaciones/3/abierta').set('Authorization', autorizacion);

    expect(cafeina.registrarIngesta.mock.calls[0][0].id_usuario).toBe('yo');
    expect(cafeina.sincronizarLote.mock.calls[0][0][0].id_usuario).toBe('yo');
    expect(cafeina.eliminarIngesta).toHaveBeenCalledWith(7, 'yo');
    expect(notificaciones.guardarSuscripcion.mock.calls[0][0].id_usuario).toBe('yo');
    expect(notificaciones.marcarAbierta).toHaveBeenCalledWith(3, 'yo');
  });
});
