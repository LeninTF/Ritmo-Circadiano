export interface SyncOperacionDto<TPayload extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
  clientId: string;
  createdAt: string;
  operation: string;
  payload: TPayload;
}

export interface SyncLoteDto<TPayload extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
  operations: readonly SyncOperacionDto<TPayload>[];
}

/** Forma JSON estable del backlog. La conversion a camelCase se hace en el borde HTTP. */
export interface SyncOperacionWireDto<TPayload extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
  client_id: string;
  created_at: string;
  operation: string;
  payload: TPayload;
}

export interface SyncLoteWireDto<TPayload extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
  operations: readonly SyncOperacionWireDto<TPayload>[];
}

export type SyncEstadoOperacion =
  | 'confirmed'
  | 'duplicate'
  | 'rejected'
  | 'retryable_failure';

export interface SyncResultadoOperacionDto {
  clientId: string;
  status: SyncEstadoOperacion;
  error?: {
    code: string;
    message: string;
  };
}

export interface SyncLoteResultadoDto {
  results: readonly SyncResultadoOperacionDto[];
}

export interface SyncResultadoOperacionWireDto {
  client_id: string;
  status: SyncEstadoOperacion;
  error?: {
    code: string;
    message: string;
  };
}

export interface SyncLoteResultadoWireDto {
  results: readonly SyncResultadoOperacionWireDto[];
}

export function syncOperacionDesdeWire(
  operacion: SyncOperacionWireDto,
): SyncOperacionDto {
  return {
    clientId: operacion.client_id,
    createdAt: operacion.created_at,
    operation: operacion.operation,
    payload: operacion.payload,
  };
}

export function syncLoteDesdeWire(
  lote: SyncLoteWireDto,
): SyncLoteDto {
  return { operations: lote.operations.map(syncOperacionDesdeWire) };
}

export function syncResultadoAFormaWire(
  resultado: SyncResultadoOperacionDto,
): SyncResultadoOperacionWireDto {
  return {
    client_id: resultado.clientId,
    status: resultado.status,
    ...(resultado.error === undefined ? {} : { error: resultado.error }),
  };
}
