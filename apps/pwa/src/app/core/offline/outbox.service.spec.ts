import 'fake-indexeddb/auto';
if (typeof globalThis.structuredClone !== 'function') {
  Object.defineProperty(globalThis, 'structuredClone', {
    value: <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T,
    configurable: true,
    writable: true,
  });
}
import { TestBed } from '@angular/core/testing';
import { DexieDb } from './dexie-db';
import { DEXIE_DB_TOKEN } from './dexie-db-token';
import { OfflineStoreService } from './offline-store.service';
import { OutboxService } from './outbox.service';
import { ISessionProvider, SESSION_PROVIDER_TOKEN } from './session-provider';
import {
  ISyncTransport,
  SYNC_TRANSPORT_TOKEN,
  SyncTransportRequest,
  SyncTransportResponse,
} from './sync-transport';
import {
  CONNECTIVITY_PROVIDER_TOKEN,
  IConnectivityProvider,
} from './connectivity-provider';
import {
  CLOCK_TOKEN,
  IClock,
  OUTBOX_RETRY_POLICY_TOKEN,
  OutboxRetryPolicy,
  IOutboxRetryScheduler,
  OUTBOX_RETRY_SCHEDULER_TOKEN,
} from './outbox-retry-policy';

class SesionPrueba implements ISessionProvider {
  usuario: string | null = 'alice';
  getUserId(): string {
    if (this.usuario === null) throw new Error('Sin sesion');
    return this.usuario;
  }
}

class PlanificadorPrueba implements IOutboxRetryScheduler {
  private nextId = 0;
  private callbacks = new Map<number, { callback: () => void; at: number }>();
  constructor(private readonly now: () => number) {}
  schedule(callback: () => void, delayMs: number): () => void {
    const id = ++this.nextId;
    this.callbacks.set(id, { callback, at: this.now() + delayMs });
    return () => { this.callbacks.delete(id); };
  }
  advanceTo(timestamp: number): void {
    for (const [id, task] of [...this.callbacks]) {
      if (task.at <= timestamp) {
        this.callbacks.delete(id);
        task.callback();
      }
    }
  }
  get size(): number { return this.callbacks.size; }
}

class ConectividadPrueba implements IConnectivityProvider {
  online = true;
  listeners = new Set<() => void>();
  isOnline(): boolean { return this.online; }
  onOnline(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  reconnect(): void {
    this.online = true;
    this.listeners.forEach((listener) => listener());
  }
}

const fechaInicial = Date.parse('2026-10-20T12:00:00.000Z');
const esperar = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('OutboxService', () => {
  let db: DexieDb;
  let store: OfflineStoreService;
  let service: OutboxService;
  let sesion: SesionPrueba;
  let conexion: ConectividadPrueba;
  let planificador: PlanificadorPrueba;
  let ahora: number;
  let requests: SyncTransportRequest[];
  let send: jest.Mock<Promise<SyncTransportResponse>, [SyncTransportRequest]>;
  const policy: OutboxRetryPolicy = {
    baseDelayMs: 1000, maxDelayMs: 2500, maxAttempts: 4,
  };

  beforeEach(() => {
    db = new DexieDb(`outbox-test-${crypto.randomUUID()}`);
    sesion = new SesionPrueba();
    conexion = new ConectividadPrueba();
    ahora = fechaInicial;
    planificador = new PlanificadorPrueba(() => ahora);
    requests = [];
    send = jest.fn(async (request: SyncTransportRequest) => {
      requests.push(request);
      return { status: 200, confirmedClientId: request.clientId };
    });
    const transport: ISyncTransport = { send: (request) => send(request) };
    const clock: IClock = { now: () => new Date(ahora) };
    TestBed.configureTestingModule({
      providers: [
        OfflineStoreService, OutboxService,
        { provide: DEXIE_DB_TOKEN, useValue: db },
        { provide: SESSION_PROVIDER_TOKEN, useValue: sesion },
        { provide: CONNECTIVITY_PROVIDER_TOKEN, useValue: conexion },
        { provide: SYNC_TRANSPORT_TOKEN, useValue: transport },
        { provide: OUTBOX_RETRY_POLICY_TOKEN, useValue: policy },
        { provide: CLOCK_TOKEN, useValue: clock },
        { provide: OUTBOX_RETRY_SCHEDULER_TOKEN, useValue: planificador },
      ],
    });
    store = TestBed.inject(OfflineStoreService);
    service = TestBed.inject(OutboxService);
  });

  afterEach(async () => {
    TestBed.resetTestingModule();
    await db.getDatabase().delete();
  });

  const encolar = async (): Promise<string> =>
    service.enqueue({ operation: 'diario', payload: { horas: 7 } });

  it('encola offline con UUID estable y conserva la operacion', async () => {
    conexion.online = false;
    const id = await encolar();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    await service.sync();
    expect(send).not.toHaveBeenCalled();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      clientId: id, usuario: 'alice', operation: 'diario',
      payload: { horas: 7 }, status: 'pending', attempts: 0,
    });
  });

  it('persiste en IndexedDB antes de llamar al transporte', async () => {
    const id = await encolar();
    send.mockImplementation(async (request) => {
      expect(request.clientId).toBe(id);
      expect(await store.getOutboxByClientId(id)).toBeDefined();
      return { status: 200, confirmedClientId: id };
    });
    await service.sync();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('elimina solamente tras 2xx con confirmacion coincidente', async () => {
    const id = await encolar();
    await service.sync();
    expect(requests[0].clientId).toBe(id);
    expect(await store.getOutboxByClientId(id)).toBeUndefined();
  });

  it('bloquea una respuesta 2xx sin confirmacion o con ID distinto', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 204 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', lastError: 'Invalid confirmation',
    });
    await store.updateOutboxRetry(id, 0, new Date(ahora).toISOString());
    send.mockResolvedValueOnce({ status: 200, confirmedClientId: 'otro' });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', lastError: 'Invalid confirmation',
    });
  });

  it.each([429, 500, 503])('reintenta HTTP %i sin borrar', async (status) => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      attempts: 1, nextRetryAt: new Date(ahora + 1000).toISOString(),
      status: 'pending',
    });
  });

  it('aplica backoff exponencial con limite y conserva el UUID', async () => {
    const id = await encolar();
    send.mockResolvedValue({ status: 503 });
    await service.sync();
    ahora += 1000;
    await service.sync();
    expect(send.mock.calls.map(([request]) => request.clientId)).toEqual([id, id]);
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      attempts: 2, nextRetryAt: new Date(ahora + 2000).toISOString(),
    });
    ahora += 2000;
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      attempts: 3, nextRetryAt: new Date(ahora + 2500).toISOString(),
    });
  });

  it('respeta nextRetryAt y no envia antes del plazo', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 429 });
    await service.sync();
    await service.sync();
    expect(send).toHaveBeenCalledTimes(1);
    ahora += 1000;
    await service.sync();
    expect(send).toHaveBeenCalledTimes(2);
    expect(await store.getOutboxByClientId(id)).toBeUndefined();
  });

  it('bloquea sin eliminar al agotar los intentos', async () => {
    const id = await encolar();
    send.mockResolvedValue({ status: 503 });
    await service.sync();
    ahora += 1000;
    await service.sync();
    ahora += 2000;
    await service.sync();
    ahora += 2500;
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', attempts: 4, lastError: 'HTTP 503',
    });
    await service.sync();
    expect(send).toHaveBeenCalledTimes(4);
  });

  it.each([401, 403])('suspende el lote ante HTTP %i', async (status) => {
    const primero = await encolar();
    await encolar();
    send.mockResolvedValueOnce({ status });
    await service.sync();
    expect(send).toHaveBeenCalledTimes(1);
    expect(await store.getOutboxByClientId(primero)).toMatchObject({
      attempts: 0, status: 'pending',
    });
    expect(await store.getMyOutbox()).toHaveLength(2);
  });

  it.each([400, 422])('bloquea HTTP %i y conserva el registro', async (status) => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', lastError: `HTTP ${status}`,
    });
  });

  it('no ejecuta sincronizaciones concurrentes', async () => {
    const id = await encolar();
    let resolver: ((response: SyncTransportResponse) => void) | undefined;
    send.mockImplementation(() => new Promise((resolve) => { resolver = resolve; }));
    const uno = service.sync();
    const dos = service.sync();
    expect(uno).toBe(dos);
    await esperar();
    expect(send).toHaveBeenCalledTimes(1);
    resolver?.({ status: 200, confirmedClientId: id });
    await Promise.all([uno, dos]);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('reanuda al recuperar conexion y libera el listener al destruirse', async () => {
    conexion.online = false;
    const id = await encolar();
    expect(conexion.listeners.size).toBe(1);
    conexion.reconnect();
    await esperar();
    expect(await store.getOutboxByClientId(id)).toBeUndefined();
    TestBed.resetTestingModule();
    expect(conexion.listeners.size).toBe(0);
  });

  it('no borra ni modifica tras cambio de sesion durante la peticion', async () => {
    const id = await encolar();
    send.mockImplementation(async () => {
      sesion.usuario = 'bob';
      return { status: 200, confirmedClientId: id };
    });
    await service.sync();
    expect(await store.getMyOutbox()).toHaveLength(0);
    sesion.usuario = 'alice';
    expect(await store.getOutboxByClientId(id)).toMatchObject({ attempts: 0 });
  });

  it('conserva operaciones ante error de red y mantiene UUID', async () => {
    const id = await encolar();
    send.mockRejectedValueOnce(new Error('offline'));
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      clientId: id, attempts: 1, status: 'pending',
    });
  });

  it('no elimina antes de confirmacion satisfactoria', async () => {
    const id = await encolar();
    let resolver: ((response: SyncTransportResponse) => void) | undefined;
    send.mockImplementation(() => new Promise((resolve) => { resolver = resolve; }));
    const pending = service.sync();
    await esperar();
    expect(await store.getOutboxByClientId(id)).toBeDefined();
    resolver?.({ status: 200, confirmedClientId: id });
    await pending;
    expect(await store.getOutboxByClientId(id)).toBeUndefined();
  });

  it('bloquea las respuestas HTTP desconocidas sin eliminar el registro', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 418 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', attempts: 0, lastError: 'Unclassified HTTP 418',
    });
  });

  it('trata un HTTP timeout como fallo temporal', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 408 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'pending', attempts: 1,
    });
  });

  it('detiene ante error de transporte 401 sin mutar ni eliminar', async () => {
    const id = await encolar();
    send.mockRejectedValueOnce({ status: 401 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'pending', attempts: 0,
    });
  });

  it('reanuda automaticamente al vencer nextRetryAt', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 429 });
    await service.sync();
    expect(send).toHaveBeenCalledTimes(1);
    send.mockResolvedValue({ status: 429 });
    ahora += 1000;
    planificador.advanceTo(ahora);
    await esperar();
    expect(send).toHaveBeenCalledTimes(2);
    expect(await store.getOutboxByClientId(id)).toMatchObject({ attempts: 2 });
  });

  it('recupera operaciones pendientes al inicializar servicio con sesion y red', async () => {
    await encolar();
    TestBed.resetTestingModule();
    const clock: IClock = { now: () => new Date(ahora) };
    TestBed.configureTestingModule({
      providers: [
        OfflineStoreService, OutboxService,
        { provide: DEXIE_DB_TOKEN, useValue: db },
        { provide: SESSION_PROVIDER_TOKEN, useValue: sesion },
        { provide: CONNECTIVITY_PROVIDER_TOKEN, useValue: conexion },
        { provide: SYNC_TRANSPORT_TOKEN, useValue: { send: (request: SyncTransportRequest) => send(request) } },
        { provide: OUTBOX_RETRY_POLICY_TOKEN, useValue: policy },
        { provide: CLOCK_TOKEN, useValue: clock },
        { provide: OUTBOX_RETRY_SCHEDULER_TOKEN, useValue: planificador },
      ],
    });
    store = TestBed.inject(OfflineStoreService);
    service = TestBed.inject(OutboxService);
    planificador.advanceTo(ahora);
    await esperar();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('no persiste una operacion si la sesion cambia durante transaccion de enqueue', async () => {
    const add = store.addOutbox.bind(store);
    let changed = false;
    jest.spyOn(store, 'addOutbox').mockImplementation(async (item, ownerId) => {
      const write = add(item, ownerId);
      sesion.usuario = 'bob';
      changed = true;
      return write;
    });
    await expect(enqueueLater()).rejects.toThrow();
    sesion.usuario = 'alice';
    expect(changed).toBe(true);
    expect(await store.getMyOutbox()).toHaveLength(0);
  });

  it('conserva operaciones no confirmadas en HTTP 2xx con ID incorrecto', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 200, confirmedClientId: 'wrong' });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      attempts: 0, status: 'blocked', lastError: 'Invalid confirmation',
    });
    expect(planificador.size).toBe(0);
  });

  it('conserva operaciones no confirmadas ante HTTP no clasificados sin loop inmediato', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 418 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      attempts: 0, status: 'blocked', lastError: 'Unclassified HTTP 418',
    });
    expect(planificador.size).toBe(0);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('el error de transporte desconocido reintenta con backoff persistido', async () => {
    const id = await encolar();
    send.mockRejectedValueOnce(new Error('network'));
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({ attempts: 1 });
    expect(planificador.size).toBe(1);
  });

  it('bloquea confirmacion invalida recibida en HTTP 2xx sin eliminar', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 200 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toMatchObject({
      status: 'blocked', lastError: 'Invalid confirmation',
    });
  });

  it('cancela listeners y temporizador al destruir el servicio', async () => {
    await encolar();
    send.mockResolvedValueOnce({ status: 429 });
    await service.sync();
    expect(planificador.size).toBe(1);
    expect(conexion.listeners.size).toBe(1);
    TestBed.resetTestingModule();
    expect(planificador.size).toBe(0);
    expect(conexion.listeners.size).toBe(0);
  });

  it('no borra operaciones cuando transport devuelve respuesta no confirmada', async () => {
    const id = await encolar();
    send.mockResolvedValueOnce({ status: 202 });
    await service.sync();
    expect(await store.getOutboxByClientId(id)).toBeDefined();
  });

  it('rechaza sincronizacion sin sesion y no transporta', async () => {
    await encolar();
    sesion.usuario = null;
    await expect(service.sync()).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });

  it('aisla operaciones de usuarios con el mismo clientId', async () => {
    await store.addOutbox({ clientId: 'shared-client', operation: 'diario', payload: {} }, 'alice');
    sesion.usuario = 'bob';
    await store.addOutbox({ clientId: 'shared-client', operation: 'diario', payload: {} }, 'bob');
    expect(await store.getOutboxByClientId('shared-client')).toMatchObject({ usuario: 'bob' });
    await store.removeOutbox('shared-client');
    sesion.usuario = 'alice';
    expect(await store.getOutboxByClientId('shared-client')).toMatchObject({ usuario: 'alice' });
  });

  const enqueueLater = (): Promise<string> => service.enqueue({
    operation: 'diario', payload: { horas: 8 },
  });

  it('no persiste credenciales incluidas accidentalmente en el payload', async () => {
    await expect(service.enqueue({
      operation: 'diario', payload: { accessToken: 'secreto' },
    })).rejects.toThrow();
    expect(await store.getMyOutbox()).toHaveLength(0);
  });

  it('sincroniza unicamente operaciones de la sesion actual', async () => {
    const idAlice = await encolar();
    sesion.usuario = 'bob';
    const idBob = await encolar();
    sesion.usuario = 'alice';
    await service.sync();
    expect(await store.getOutboxByClientId(idAlice)).toBeUndefined();
    sesion.usuario = 'bob';
    expect(await store.getOutboxByClientId(idBob)).toBeDefined();
    expect(requests.map((request) => request.clientId)).toEqual([idAlice]);
  });

});
