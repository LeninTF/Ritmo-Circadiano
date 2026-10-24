export interface QueueOperation<TPayload = unknown> {
  readonly clientId: string;
  readonly userId: string;
  readonly operation: string;
  readonly createdAt: string;
  readonly payload: TPayload;
  readonly retryCount: number;
}

export interface ServerOperationResult {
  readonly clientId: string;
  readonly status: 'confirmed' | 'duplicate' | 'rejected' | 'retryable_failure';
  readonly error?: { readonly code: string; readonly message: string };
}

export interface ServerBatchResponse {
  readonly results: readonly ServerOperationResult[];
}

export interface RejectedOperation<TPayload = unknown> {
  readonly operation: QueueOperation<TPayload>;
  readonly reason: string;
  readonly error?: { readonly code: string; readonly message: string };
}

export interface ReconcileQueueResult<TPayload = unknown> {
  readonly remainingQueue: readonly QueueOperation<TPayload>[];
  readonly confirmedClientIds: readonly string[];
  readonly duplicateClientIds: readonly string[];
  readonly rejectedClientIds: readonly string[];
  readonly rejectedOperations: readonly RejectedOperation<TPayload>[];
  readonly retryableClientIds: readonly string[];
  readonly unacknowledgedClientIds: readonly string[];
}

export const MAX_QUEUE_RETRIES = 5;

/**
 * Reconcilia el estado local de la cola Outbox con la respuesta recibida del servidor.
 * Función pura: no muta la cola original y produce un resultado determinista.
 * Conserva íntegramente las operaciones rechazadas en `rejectedOperations` para evitar
 * pérdida de datos o descarte silencioso de información.
 */
export function reconciliarColaSincronizacion<TPayload>(
  queue: readonly QueueOperation<TPayload>[],
  serverResponse: ServerBatchResponse | null | undefined,
  maxRetries = MAX_QUEUE_RETRIES,
): ReconcileQueueResult<TPayload> {
  // Si no hay respuesta (pérdida de red total / timeout), todas las operaciones permanecen en cola
  if (!serverResponse || !Array.isArray(serverResponse.results)) {
    return {
      remainingQueue: queue.map((op) => ({ ...op, retryCount: op.retryCount + 1 })),
      confirmedClientIds: [],
      duplicateClientIds: [],
      rejectedClientIds: [],
      rejectedOperations: [],
      retryableClientIds: queue.map((op) => op.clientId),
      unacknowledgedClientIds: queue.map((op) => op.clientId),
    };
  }

  // Mapa de resultados por clientId
  const resultMap = new Map<string, ServerOperationResult>();
  for (const res of serverResponse.results) {
    if (res && typeof res.clientId === 'string') {
      const prev = resultMap.get(res.clientId);
      if (!prev) {
        resultMap.set(res.clientId, res);
      } else if (prev.status === 'retryable_failure' && res.status !== 'retryable_failure') {
        resultMap.set(res.clientId, res);
      }
    }
  }

  const remainingQueue: QueueOperation<TPayload>[] = [];
  const confirmedClientIds: string[] = [];
  const duplicateClientIds: string[] = [];
  const rejectedClientIds: string[] = [];
  const rejectedOperations: RejectedOperation<TPayload>[] = [];
  const retryableClientIds: string[] = [];
  const unacknowledgedClientIds: string[] = [];

  for (const op of queue) {
    const serverResult = resultMap.get(op.clientId);

    if (!serverResult) {
      unacknowledgedClientIds.push(op.clientId);
      remainingQueue.push({ ...op, retryCount: op.retryCount + 1 });
      continue;
    }

    switch (serverResult.status) {
      case 'confirmed':
        confirmedClientIds.push(op.clientId);
        break;

      case 'duplicate':
        duplicateClientIds.push(op.clientId);
        break;

      case 'rejected':
        rejectedClientIds.push(op.clientId);
        rejectedOperations.push({
          operation: op,
          reason: 'Operación rechazada permanentemente por el servidor.',
          error: serverResult.error,
        });
        break;

      case 'retryable_failure':
        retryableClientIds.push(op.clientId);
        if (op.retryCount + 1 < maxRetries) {
          remainingQueue.push({ ...op, retryCount: op.retryCount + 1 });
        } else {
          rejectedClientIds.push(op.clientId);
          rejectedOperations.push({
            operation: op,
            reason: `Operación excedió el límite máximo de reintentos (${maxRetries}).`,
            error: serverResult.error,
          });
        }
        break;
    }
  }

  return {
    remainingQueue,
    confirmedClientIds,
    duplicateClientIds,
    rejectedClientIds,
    rejectedOperations,
    retryableClientIds,
    unacknowledgedClientIds,
  };
}

/**
 * Filtra las operaciones de la cola pertenecientes exclusivamente al usuario autenticado.
 * Garantiza el aislamiento estricto de datos offline entre diferentes participantes.
 */
export function filtrarColaPorUsuario<TPayload>(
  queue: readonly QueueOperation<TPayload>[],
  userId: string,
): readonly QueueOperation<TPayload>[] {
  if (!userId || typeof userId !== 'string') return [];
  return queue.filter((op) => op.userId === userId);
}

