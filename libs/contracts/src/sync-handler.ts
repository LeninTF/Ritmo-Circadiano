import { SyncOperacionDto } from './sync-lote.dto';

export interface SyncIdentity {
  readonly userId: string;
}

export interface SyncHandlerResult {
  readonly status: 'confirmed' | 'duplicate' | 'rejected' | 'retryable_failure';
  readonly code?: string;
  readonly message?: string;
}

/**
 * Puerto propiedad del agregado: el handler implementa la unicidad de clientId,
 * identidad/payload y atomicidad del efecto en la persistencia del propio dominio.
 * No debe reservar en memoria ni hacer SELECT seguido de INSERT sin UNIQUE.
 */
export interface SyncDomainIdempotency {
  execute(
    identity: SyncIdentity,
    operation: SyncOperacionDto,
    effect: () => Promise<SyncHandlerResult>,
  ): Promise<SyncHandlerResult>;
}

/** El handler decide la política de idempotencia y ejecuta el efecto de dominio. */
export interface SyncOperationHandler<TOperation extends string = string> {
  readonly operation: TOperation;
  handle(operation: SyncOperacionDto, identity: SyncIdentity): Promise<SyncHandlerResult>;
}

export const SYNC_DOMAIN_IDEMPOTENCY = Symbol('SYNC_DOMAIN_IDEMPOTENCY');
