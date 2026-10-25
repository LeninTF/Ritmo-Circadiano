import {
  reconciliarColaSincronizacion,
  filtrarColaPorUsuario,
  QueueOperation,
  ServerBatchResponse,
} from './sync-queue';

describe('Tests de Sincronización y Cola', () => {
  const basePayload = { horasSueno: 7.5, calidadPercibida: 4 };

  it('10. Reconexión', () => {
    const cola: QueueOperation[] = [{ clientId: 'op-1', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T06:00:00.000Z', payload: basePayload, retryCount: 0 }];
    const res = reconciliarColaSincronizacion(cola, null);
    expect(res.remainingQueue[0].retryCount).toBe(1);
  });

  it('11. Lote parcial', () => {
    const cola: QueueOperation[] = [
      { clientId: 'op-1', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 0 },
      { clientId: 'op-2', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T02:00:00.000Z', payload: basePayload, retryCount: 0 },
    ];
    const resp: ServerBatchResponse = {
      results: [{ clientId: 'op-1', status: 'confirmed' }, { clientId: 'op-2', status: 'retryable_failure' }],
    };
    const res = reconciliarColaSincronizacion(cola, resp);
    expect(res.confirmedClientIds).toEqual(['op-1']);
    expect(res.retryableClientIds).toEqual(['op-2']);
  });

  it('12. Recuperable', () => {
    const cola: QueueOperation[] = [{ clientId: 'op-t', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 1 }];
    const resp: ServerBatchResponse = { results: [{ clientId: 'op-t', status: 'retryable_failure' }] };
    const res = reconciliarColaSincronizacion(cola, resp);
    expect(res.remainingQueue[0].retryCount).toBe(2);
  });

  it('13. Rechazo permanente preserva payload original en rejectedOperations', () => {
    const cola: QueueOperation[] = [{
      clientId: 'op-b', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z',
      payload: { ...basePayload, custom: 'payload-preservado' }, retryCount: 0
    }];
    const resp: ServerBatchResponse = {
      results: [{ clientId: 'op-b', status: 'rejected', error: { code: 'ERR', message: 'Reject' } }],
    };
    const res = reconciliarColaSincronizacion(cola, resp);
    expect(res.rejectedClientIds).toEqual(['op-b']);
    expect(res.rejectedOperations).toHaveLength(1);
    expect(res.rejectedOperations[0].operation.payload).toEqual({ ...basePayload, custom: 'payload-preservado' });
  });

  it('14. Duplicadas', () => {
    const cola: QueueOperation[] = [{ clientId: 'op-dup', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 0 }];
    const resp: ServerBatchResponse = { results: [{ clientId: 'op-dup', status: 'confirmed' }] };
    const res = reconciliarColaSincronizacion(cola, resp);
    expect(res.confirmedClientIds).toContain('op-dup');
  });

  it('15. Incompletas', () => {
    const cola: QueueOperation[] = [{ clientId: 'op-inc', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 0 }];
    const res = reconciliarColaSincronizacion(cola, { results: [] });
    expect(res.unacknowledgedClientIds).toEqual(['op-inc']);
  });

  it('16. Agota reintentos', () => {
    const cola: QueueOperation[] = [{ clientId: 'op-max', userId: 'user-1', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 4 }];
    const res = reconciliarColaSincronizacion(cola, { results: [{ clientId: 'op-max', status: 'retryable_failure' }] }, 5);
    expect(res.rejectedClientIds).toContain('op-max');
    expect(res.rejectedOperations).toHaveLength(1);
  });

  it('17. Aislamiento offline', () => {
    const cola: QueueOperation[] = [
      { clientId: 'op-1', userId: 'user-A', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 0 },
      { clientId: 'op-2', userId: 'user-B', operation: 'OP', createdAt: '2026-10-21T01:00:00.000Z', payload: basePayload, retryCount: 0 },
    ];
    expect(filtrarColaPorUsuario(cola, 'user-A')).toHaveLength(1);
  });
});
 describe("Tests de Sincronización, Reconexión y Cola Parcial (Requisitos 10..19)", () => { const basePayload = { horasSueno: 7.5, calidadPercibida: 4 }; it("10. Maneja reconexión tras pérdida de red incrementando retryCount", () => { const cola: QueueOperation[] = [{ clientId: "op-1", userId: "user-1", operation: "OP", createdAt: "2026-10-21T06:00:00.000Z", payload: basePayload, retryCount: 0 }]; const res = reconciliarColaSincronizacion(cola, null); expect(res.remainingQueue).toHaveLength(1); expect(res.remainingQueue[0].retryCount).toBe(1); }); it("11. Procesa lote parcialmente exitoso", () => { const cola: QueueOperation[] = [{ clientId: "op-1", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }, { clientId: "op-2", userId: "user-1", operation: "OP", createdAt: "2026-10-21T02:00:00.000Z", payload: basePayload, retryCount: 0 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-1", status: "confirmed" }, { clientId: "op-2", status: "retryable_failure" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.confirmedClientIds).toEqual(["op-1"]); expect(res.retryableClientIds).toEqual(["op-2"]); }); it("12. Errores recuperables", () => { const cola: QueueOperation[] = [{ clientId: "op-t", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 1 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-t", status: "retryable_failure" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.remainingQueue[0].retryCount).toBe(2); }); it("13. Errores permanentes", () => { const cola: QueueOperation[] = [{ clientId: "op-b", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-b", status: "rejected" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.remainingQueue).toHaveLength(0); }); it("14. Respuestas duplicadas", () => { const cola: QueueOperation[] = [{ clientId: "op-1", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-1", status: "confirmed" }, { clientId: "op-1", status: "confirmed" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.confirmedClientIds).toContain("op-1"); }); it("15. Respuestas incompletas", () => { const cola: QueueOperation[] = [{ clientId: "op-1", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }, { clientId: "op-2", userId: "user-1", operation: "OP", createdAt: "2026-10-21T02:00:00.000Z", payload: basePayload, retryCount: 0 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-1", status: "confirmed" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.unacknowledgedClientIds).toEqual(["op-2"]); }); it("16. Respuestas fuera de orden", () => { const cola: QueueOperation[] = [{ clientId: "op-a", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }, { clientId: "op-b", userId: "user-1", operation: "OP", createdAt: "2026-10-21T02:00:00.000Z", payload: basePayload, retryCount: 0 }]; const resp: ServerBatchResponse = { results: [{ clientId: "op-b", status: "confirmed" }, { clientId: "op-a", status: "confirmed" }] }; const res = reconciliarColaSincronizacion(cola, resp); expect(res.confirmedClientIds).toEqual(["op-a", "op-b"]); }); it("18. Aislamiento entre usuarios", () => { const cola: QueueOperation[] = [{ clientId: "1", userId: "A", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }, { clientId: "2", userId: "B", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }]; expect(filtrarColaPorUsuario(cola, "A")).toHaveLength(1); }); it("19. Prevención de pérdida de operaciones", () => { const cola: QueueOperation[] = [{ clientId: "op-v", userId: "user-1", operation: "OP", createdAt: "2026-10-21T01:00:00.000Z", payload: basePayload, retryCount: 0 }]; const res = reconciliarColaSincronizacion(cola, { results: [] }); expect(res.remainingQueue).toHaveLength(1); }); });
