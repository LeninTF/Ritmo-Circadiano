import {
  SyncHandlerResult,
  SyncIdentity,
  SyncOperacionDto,
  SyncOperationHandler,
} from '@circadiano/contracts';
import { SyncHandlerRegistry, UnknownSyncHandlerError } from './sync-handler.registry';
import {
  InvalidSyncBatchError,
  SyncOrchestratorService,
} from './sync-orchestrator.service';

class FakeHandler implements SyncOperationHandler {
  readonly operation = 'diario';
  readonly calls: Array<{ userId: string; clientId: string }> = [];
  readonly outcomes = new Map<string, SyncHandlerResult>();
  readonly failures = new Set<string>();
  readonly results = new Map<string, SyncHandlerResult>();
  readonly deduplicated = new Set<string>();

  async handle(operation: SyncOperacionDto, identity: SyncIdentity): Promise<SyncHandlerResult> {
    if (this.deduplicated.has(operation.clientId)) return { status: 'duplicate' };
    this.calls.push({ userId: identity.userId, clientId: operation.clientId });
    if (this.failures.has(operation.clientId)) {
      if (operation.clientId === 'collision') {
        const error = new Error('clientId conflicts with another operation or payload');
        error.name = 'SyncClientIdCollisionError';
        throw error;
      }
      throw new Error('storage unavailable');
    }
    return this.results.get(operation.clientId)
      ?? this.outcomes.get(operation.clientId)
      ?? { status: 'confirmed' };
  }
}

const op = (clientId: string, operation = 'diario'): SyncOperacionDto => ({
  clientId,
  createdAt: '2026-10-20T10:00:00.000Z',
  operation,
  payload: { horas: 8 },
});

describe('SyncHandlerRegistry', () => {
  it('registra handlers unicos y rechaza operaciones desconocidas', () => {
    const registry = new SyncHandlerRegistry([new FakeHandler()]);
    expect(registry.has('diario')).toBe(true);
    expect(() => registry.get('ingesta')).toThrow(UnknownSyncHandlerError);
  });

  it('rechaza handlers duplicados para la misma operacion', () => {
    expect(() => new SyncHandlerRegistry([new FakeHandler(), new FakeHandler()]))
      .toThrow('Duplicate sync handler: diario');
  });
});

describe('SyncOrchestratorService', () => {
  let handler: FakeHandler;
  let service: SyncOrchestratorService;

  beforeEach(() => {
    handler = new FakeHandler();
    service = new SyncOrchestratorService(new SyncHandlerRegistry([handler]));
  });

  it('valida lote, usuario y operaciones antes de procesar', async () => {
    await expect(service.process({ operations: [] }, { userId: 'alice' }))
      .rejects.toThrow(InvalidSyncBatchError);
    await expect(service.process({ operations: [op('1')] }, { userId: ' ' }))
      .rejects.toThrow('Authenticated user identity is required');
    await expect(service.process({ operations: [op('')] }, { userId: 'alice' }))
      .rejects.toThrow('clientId is required');
    await expect(service.process({ operations: [op('1', '')] }, { userId: 'alice' }))
      .rejects.toThrow('operation is required');
    await expect(service.process({ operations: [{ ...op('1'), createdAt: 'invalid' }] }, { userId: 'alice' }))
      .rejects.toThrow('createdAt must be a valid date');
    await expect(service.process({ operations: [{ ...op('1'), payload: [] as unknown as Readonly<Record<string, unknown>> }] }, { userId: 'alice' }))
      .rejects.toThrow('payload must be an object');
    expect(handler.calls).toHaveLength(0);
  });

  it('rechaza handler desconocido sin confirmacion exitosa', async () => {
    const response = await service.process(
      { operations: [op('unsupported', 'ingesta')] }, { userId: 'alice' },
    );
    expect(response.results).toEqual([{
      clientId: 'unsupported', status: 'rejected',
      error: { code: 'SYNC_UNSUPPORTED_OPERATION', message: 'Operation is not supported' },
    }]);
    expect(handler.calls).toHaveLength(0);
  });

  it('correlaciona clientId y procesa multiples operaciones', async () => {
    const response = await service.process(
      { operations: [op('c-1'), op('c-2')] }, { userId: 'alice' },
    );
    expect(response.results).toEqual([
      { clientId: 'c-1', status: 'confirmed' },
      { clientId: 'c-2', status: 'confirmed' },
    ]);
    expect(handler.calls).toHaveLength(2);
    expect(handler.calls.map((call) => call.clientId)).toEqual(['c-1', 'c-2']);
  });

  it('mantiene resultados parciales de rechazo y error transitorio', async () => {
    handler.outcomes.set('rejected', {
      status: 'rejected', code: 'INVALID_ENTRY', message: 'Invalid entry',
    });
    handler.failures.add('temporary');
    const response = await service.process(
      { operations: [op('ok'), op('rejected'), op('temporary')] }, { userId: 'alice' },
    );
    expect(response.results.map(({ clientId, status }) => [clientId, status])).toEqual([
      ['ok', 'confirmed'], ['rejected', 'rejected'], ['temporary', 'retryable_failure'],
    ]);
    expect(response.results[1].error?.code).toBe('INVALID_ENTRY');
    expect(response.results[2].error?.code).toBe('SYNC_TEMPORARY_FAILURE');
    expect(handler.calls[2]).toEqual({ userId: 'alice', clientId: 'temporary' });
  });

  it('reconoce duplicado legitimo sin repetir el efecto del handler', async () => {
    handler.deduplicated.add('same');
    const response = await service.process(
      { operations: [op('same')] }, { userId: 'alice' },
    );
    expect(response.results).toEqual([{ clientId: 'same', status: 'duplicate' }]);
    expect(handler.calls).toHaveLength(0);
  });

  it('rechaza colision de clientId sin invocar el handler', async () => {
    handler.failures.add('collision');
    const response = await service.process(
      { operations: [op('collision')] }, { userId: 'alice' },
    );
    expect(response.results[0]).toMatchObject({
      clientId: 'collision', status: 'rejected',
      error: { code: 'SYNC_CLIENT_ID_COLLISION' },
    });
    expect(handler.calls).toEqual([{ userId: 'alice', clientId: 'collision' }]);
  });

  it('rechaza clientId repetido en el mismo lote', async () => {
    await expect(service.process(
      { operations: [op('reused'), op('reused')] }, { userId: 'alice' },
    )).rejects.toThrow('Duplicate clientId within batch');
    expect(handler.calls).toHaveLength(0);
  });

  it('aisla usuario desde el contexto y lo entrega al handler', async () => {
    await service.process({ operations: [op('alice-op')] }, { userId: 'alice' });
    await service.process({ operations: [op('bob-op')] }, { userId: 'bob' });
    expect(handler.calls).toEqual([
      { userId: 'alice', clientId: 'alice-op' },
      { userId: 'bob', clientId: 'bob-op' },
    ]);
  });
});
