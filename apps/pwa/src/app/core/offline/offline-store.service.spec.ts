import 'fake-indexeddb/auto';
if (typeof globalThis.structuredClone !== 'function') {
  Object.defineProperty(globalThis, 'structuredClone', {
    value: <T>(value: T): T =>
      JSON.parse(JSON.stringify(value)) as T,
    configurable: true,
    writable: true,
  });
}

import { TestBed } from '@angular/core/testing';
import { DexieDb } from './dexie-db';
import { DEXIE_DB_TOKEN } from './dexie-db-token';
import { OfflineStoreService } from './offline-store.service';
import {
  ISessionProvider,
  SESSION_PROVIDER_TOKEN,
} from './session-provider';

class MockSessionProvider implements ISessionProvider {
  private activeUser: string | null = null;

  login(userId: string): void {
    this.activeUser = userId;
  }

  logout(): void {
    this.activeUser = null;
  }

  getUserId(): string {
    if (this.activeUser === null) {
      throw new Error('No active session');
    }

    return this.activeUser;
  }
}

describe('OfflineStoreService', () => {
  let service: OfflineStoreService;
  let session: MockSessionProvider;
  let database: DexieDb;
  let dbName: string;

  beforeEach(() => {
    dbName = `offline-test-${crypto.randomUUID()}`;
    database = new DexieDb(dbName);
    session = new MockSessionProvider();

    TestBed.configureTestingModule({
      providers: [
        OfflineStoreService,
        { provide: DEXIE_DB_TOKEN, useValue: database },
        { provide: SESSION_PROVIDER_TOKEN, useValue: session },
      ],
    });

    service = TestBed.inject(OfflineStoreService);
  });

  afterEach(async () => {
    await database.getDatabase().delete();
    TestBed.resetTestingModule();
  });

  it('guarda y recupera planes', async () => {
    session.login('alice');

    const id = await service.addPlan({
      fecha: '2026-10-20',
      data: { objetivo: 'descanso' },
    });

    const planes = await service.getMyPlans();

    expect(id).toBeGreaterThan(0);
    expect(planes).toHaveLength(1);
    expect(planes[0]).toMatchObject({
      id,
      fecha: '2026-10-20',
      usuario: 'alice',
      data: { objetivo: 'descanso' },
    });
  });

  it('reemplaza el plan y el evento solar de la misma fecha en vez de duplicarlos', async () => {
    session.login('alice');
    const id = await service.addPlan({ fecha: '2026-10-20', data: { version: 1 } });
    expect(await service.addPlan({ fecha: '2026-10-20', data: { version: 2 } })).toBe(id);
    await service.addPlan({ fecha: '2026-10-21', data: { version: 1 } });
    await service.addEventoSolar({ fecha: '2026-10-20', data: { amanecer: 'a' } });
    await service.addEventoSolar({ fecha: '2026-10-20', data: { amanecer: 'b' } });

    const planes = await service.getMyPlans();
    expect(planes).toHaveLength(2);
    expect(planes.find((p) => p.fecha === '2026-10-20')?.data).toEqual({ version: 2 });
    expect(await service.getMyEventosSolares()).toEqual([
      expect.objectContaining({ fecha: '2026-10-20', data: { amanecer: 'b' } }),
    ]);
  });

  it('guarda y recupera registros de los otros stores', async () => {
    session.login('alice');

    await service.addEventoSolar({
      fecha: '2026-10-20',
      data: { evento: 'amanecer' },
    });

    await service.addTurno({
      fecha: '2026-10-20',
      data: { tipo: 'nocturno' },
    });

    await service.addIngesta({
      fecha: '2026-10-20',
      data: { bebida: 'cafe' },
    });

    await service.addDiario({
      fecha: '2026-10-20',
      data: { horasSueno: 7 },
    });

    expect(await service.getMyEventosSolares()).toHaveLength(1);
    expect(await service.getMyTurnos()).toHaveLength(1);
    expect(await service.getMyIngestas()).toHaveLength(1);
    expect(await service.getMyDiarios()).toHaveLength(1);
  });

  it('borra solo las ingestas propias con ese clientId', async () => {
    session.login('alice');
    await service.addIngesta({ fecha: '2026-10-20T13:00:00.000Z', data: { clientId: 'a' } });
    await service.addIngesta({ fecha: '2026-10-20T14:00:00.000Z', data: { clientId: 'b' } });
    session.login('bob');
    await service.addIngesta({ fecha: '2026-10-20T13:00:00.000Z', data: { clientId: 'a' } });

    session.login('alice');
    await service.removeIngestaPorClientId('a');

    expect((await service.getMyIngestas()).map((i) => i.data)).toEqual([{ clientId: 'b' }]);
    session.login('bob');
    expect(await service.getMyIngestas()).toHaveLength(1);
  });

  it('aísla los datos de cada trabajador', async () => {
    session.login('alice');

    const aliceId = await service.addPlan({
      fecha: '2026-10-20',
      data: { valor: 'A' },
    });

    session.login('bob');

    const bobId = await service.addPlan({
      fecha: '2026-10-21',
      data: { valor: 'B' },
    });

    const bobPlans = await service.getMyPlans();

    expect(bobPlans).toHaveLength(1);
    expect(bobPlans[0].id).toBe(bobId);
    expect(bobPlans[0].usuario).toBe('bob');

    session.login('alice');

    const alicePlans = await service.getMyPlans();

    expect(alicePlans).toHaveLength(1);
    expect(alicePlans[0].id).toBe(aliceId);
    expect(alicePlans[0].usuario).toBe('alice');
  });

  it('rechaza operaciones cuando no existe sesión', async () => {
    session.logout();

    await expect(
      service.addPlan({ fecha: '2026-10-20' }),
    ).rejects.toThrow();

    await expect(service.getMyPlans()).rejects.toThrow();

    await expect(
      service.addOutbox({ clientId: 'sin-sesion' }),
    ).rejects.toThrow();
  });

  it('rechaza identificadores de usuario vacíos', async () => {
    session.login('   ');

    await expect(
      service.addPlan({ fecha: '2026-10-20' }),
    ).rejects.toThrow();
  });

  it('impide duplicar clientId dentro del mismo usuario', async () => {
    session.login('alice');

    await service.addOutbox({
      clientId: 'operation-001',
      data: { accion: 'guardar' },
    });

    await expect(
      service.addOutbox({
        clientId: 'operation-001',
        data: { accion: 'duplicada' },
      }),
    ).rejects.toThrow();

    expect(await service.getMyOutbox()).toHaveLength(1);
  });

  it('permite el mismo clientId para usuarios distintos', async () => {
    session.login('alice');
    await service.addOutbox({ clientId: 'operation-001' });

    session.login('bob');
    await service.addOutbox({ clientId: 'operation-001' });

    expect(await service.getMyOutbox()).toHaveLength(1);

    session.login('alice');
    expect(await service.getMyOutbox()).toHaveLength(1);
  });

  it('conserva Outbox al cambiar de sesión', async () => {
    session.login('alice');

    await service.addOutbox({
      clientId: 'pending-001',
    });

    session.logout();
    session.login('bob');

    expect(await service.getMyOutbox()).toHaveLength(0);

    session.login('alice');

    const pendientes = await service.getMyOutbox();

    expect(pendientes).toHaveLength(1);
    expect(pendientes[0].clientId).toBe('pending-001');
  });

  it('conserva registros al cerrar y reabrir IndexedDB', async () => {
    session.login('alice');

    await service.addOutbox({
      clientId: 'persistent-001',
    });

    database.getDatabase().close();

    const reopenedDatabase = new DexieDb(dbName);

    try {
      const records = await reopenedDatabase
        .getDatabase()
        .table('outbox')
        .toArray();

      expect(records).toHaveLength(1);
      expect(records[0].clientId).toBe('persistent-001');
      expect(records[0].usuario).toBe('alice');
    } finally {
      reopenedDatabase.getDatabase().close();
    }
  });

  it('inicializa estado pending e intentos 0 al crear outbox', async () => {
    session.login('alice');
    const clientId = 'init-client-01';
    await service.addOutbox({ clientId, data: { test: true } });

    const item = await service.getOutboxByClientId(clientId);
    expect(item).toBeDefined();
    expect(item?.status).toBe('pending');
    expect(item?.attempts).toBe(0);
    expect(item?.createdAt).toBeDefined();
  });

  it('rechaza clientId vacío o inválido', async () => {
    session.login('alice');
    await expect(service.addOutbox({ clientId: '   ' })).rejects.toThrow();
    await expect(service.getOutboxByClientId('')).rejects.toThrow();
    await expect(service.updateOutboxRetry('', 1, new Date().toISOString())).rejects.toThrow();
    await expect(service.markOutboxBlocked('', 'error')).rejects.toThrow();
    await expect(service.removeOutbox('')).rejects.toThrow();
  });

  it('recupera operaciones pendientes mediante getPendingOutbox', async () => {
    session.login('alice');
    await service.addOutbox({ clientId: 'op-1' });
    await service.addOutbox({ clientId: 'op-2' });

    await service.markOutboxBlocked('op-2', 'Fatal error');

    const pending = await service.getPendingOutbox();
    expect(pending).toHaveLength(1);
    expect(pending[0].clientId).toBe('op-1');
  });

  it('actualiza reintentos con updateOutboxRetry correctamente', async () => {
    session.login('alice');
    const clientId = 'retry-client';
    await service.addOutbox({ clientId });

    const nextRetry = new Date(Date.now() + 10000).toISOString();
    await service.updateOutboxRetry(clientId, 2, nextRetry, 'Network error');

    const item = await service.getOutboxByClientId(clientId);
    expect(item?.attempts).toBe(2);
    expect(item?.nextRetryAt).toBe(nextRetry);
    expect(item?.lastError).toBe('Network error');
    expect(item?.status).toBe('pending');
  });

  it('rechaza intentos negativos en updateOutboxRetry', async () => {
    session.login('alice');
    const clientId = 'neg-client';
    await service.addOutbox({ clientId });

    await expect(
      service.updateOutboxRetry(clientId, -1, new Date().toISOString())
    ).rejects.toThrow();
  });

  it('marca una operación como bloqueada con markOutboxBlocked', async () => {
    session.login('alice');
    const clientId = 'block-client';
    await service.addOutbox({ clientId });

    await service.markOutboxBlocked(clientId, 'Max attempts reached');
    const item = await service.getOutboxByClientId(clientId);
    expect(item?.status).toBe('blocked');
    expect(item?.lastError).toBe('Max attempts reached');
  });

  it('elimina de forma autorizada mediante removeOutbox', async () => {
    session.login('alice');
    const clientId = 'remove-client';
    await service.addOutbox({ clientId });

    expect(await service.getOutboxByClientId(clientId)).toBeDefined();
    await service.removeOutbox(clientId);
    expect(await service.getOutboxByClientId(clientId)).toBeUndefined();
  });

  it('protege registros frente a modificación y eliminación de otro usuario', async () => {
    session.login('alice');
    const clientId = 'cross-user-client';
    await service.addOutbox({ clientId, data: { owner: 'alice' } });

    session.login('bob');
    expect(await service.getOutboxByClientId(clientId)).toBeUndefined();

    await expect(
      service.updateOutboxRetry(clientId, 1, new Date().toISOString())
    ).rejects.toThrow();

    await service.removeOutbox(clientId);

    session.login('alice');
    const aliceItem = await service.getOutboxByClientId(clientId);
    expect(aliceItem).toBeDefined();
    expect(aliceItem?.usuario).toBe('alice');
  });

  it('persiste metadatos outbox (intentos y estado) tras cerrar y reabrir IndexedDB', async () => {
    session.login('alice');
    const clientId = 'persist-meta';
    await service.addOutbox({ clientId });
    const nextRetry = new Date().toISOString();
    await service.updateOutboxRetry(clientId, 3, nextRetry, 'Timeout');

    database.getDatabase().close();
    const reopenedDatabase = new DexieDb(dbName);

    try {
      const records = await reopenedDatabase
        .getDatabase()
        .table('outbox')
        .toArray();

      expect(records).toHaveLength(1);
      expect(records[0].attempts).toBe(3);
      expect(records[0].lastError).toBe('Timeout');
      expect(records[0].status).toBe('pending');
    } finally {
      reopenedDatabase.getDatabase().close();
    }
  });
});