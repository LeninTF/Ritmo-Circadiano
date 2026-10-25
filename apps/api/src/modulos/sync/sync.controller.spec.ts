import { randomBytes } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { SyncOperationHandler } from '@circadiano/contracts';
import { JwtAuthGuard, RolesGuard } from '../plataforma/auth';
import { SyncController } from './sync.controller';
import { SyncHandlerRegistry } from './sync-handler.registry';
import { SyncOrchestratorService } from './sync-orchestrator.service';

describe('POST /sync/lote con guards reales (RNF03, RNF04)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const diario = { operation: 'diario', handle: jest.fn() } satisfies SyncOperationHandler;
  const operacion = (client_id: string, operation = 'diario') => ({
    client_id,
    created_at: '2026-10-21T07:00:00.000Z',
    operation,
    payload: { fecha: '2026-10-21' },
  });
  const token = (rol: string) =>
    jwt.signAsync({ sub: 'yo', rol, codigoParticipante: 'P01' }).then((t) => `Bearer ${t}`);

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [SyncController],
      providers: [
        SyncOrchestratorService,
        { provide: SyncHandlerRegistry, useValue: new SyncHandlerRegistry([diario]) },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
    jwt = app.get(JwtService);
  });

  afterAll(() => app.close());
  beforeEach(() => diario.handle.mockReset().mockResolvedValue({ status: 'confirmed' }));

  it('sin token 401 y con rol distinto de trabajador 403', async () => {
    const http = request(app.getHttpServer());
    await http.post('/sync/lote').send({ operations: [operacion('a')] }).expect(401);
    await http
      .post('/sync/lote')
      .set('Authorization', await token('despachador'))
      .send({ operations: [operacion('a')] })
      .expect(403);
    expect(diario.handle).not.toHaveBeenCalled();
  });

  it('responde en snake_case por client_id usando el sub del token', async () => {
    const res = await request(app.getHttpServer())
      .post('/sync/lote')
      .set('Authorization', await token('trabajador'))
      .send({ operations: [operacion('a'), operacion('b', 'desconocida')] })
      .expect(200);
    expect(res.body).toEqual({
      results: [
        { client_id: 'a', status: 'confirmed' },
        { client_id: 'b', status: 'rejected', error: expect.objectContaining({ code: 'SYNC_UNSUPPORTED_OPERATION' }) },
      ],
    });
    expect(diario.handle).toHaveBeenCalledWith(expect.objectContaining({ clientId: 'a' }), { userId: 'yo' });
  });

  it.each([
    ['sin operations', {}],
    ['lista vacia', { operations: [] }],
    ['operacion no objeto', { operations: [null] }],
    ['client_id repetido', { operations: [operacion('a'), operacion('a')] }],
  ])('lote invalido (%s) responde 400', async (_caso, cuerpo) => {
    await request(app.getHttpServer())
      .post('/sync/lote')
      .set('Authorization', await token('trabajador'))
      .send(cuerpo)
      .expect(400);
    expect(diario.handle).not.toHaveBeenCalled();
  });
});
