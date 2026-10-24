import { expect, describe, it } from '@jest/globals';
import {
  syncLoteDesdeWire,
  syncOperacionDesdeWire,
  syncResultadoAFormaWire,
  SyncOperacionDto,
} from './sync-lote.dto';


describe('contratos de sincronizacion', () => {
  it('mapea wire snake_case a camelCase sin alterar client_id', () => {
    const wire = {
      client_id: 'same-id',
      created_at: '2026-10-20T10:00:00.000Z',
      operation: 'diario',
      payload: { horas: 8 },
    };
    const internal = syncOperacionDesdeWire(wire);
    const batch = syncLoteDesdeWire({ operations: [wire] });
    expect(batch.operations[0]).toEqual(internal);
    expect(internal).toEqual({
      clientId: 'same-id', createdAt: wire.created_at,
      operation: 'diario', payload: wire.payload,
    });
    expect(internal.clientId).toBe(wire.client_id);
  });

  it('serializa resultados preservando estado y correlacion', () => {
    const internal: SyncOperacionDto = {
      clientId: 'id-1', createdAt: '2026-10-20T10:00:00.000Z',
      operation: 'diario', payload: {},
    };
    expect(syncResultadoAFormaWire({
      clientId: internal.clientId,
      status: 'retryable_failure',
      error: { code: 'TEMPORARY', message: 'Retry later' },
    })).toEqual({
      client_id: 'id-1', status: 'retryable_failure',
      error: { code: 'TEMPORARY', message: 'Retry later' },
    });
  });
});
