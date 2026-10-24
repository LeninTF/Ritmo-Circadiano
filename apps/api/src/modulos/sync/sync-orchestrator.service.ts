import { Injectable } from '@nestjs/common';
import {
  SyncHandlerResult,
  SyncIdentity,
  SyncLoteDto,
  SyncLoteResultadoDto,
  SyncOperacionDto,
} from '@circadiano/contracts';
import { SyncHandlerRegistry } from './sync-handler.registry';

export class InvalidSyncBatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSyncBatchError';
  }
}

@Injectable()
export class SyncOrchestratorService {
  constructor(private readonly registry: SyncHandlerRegistry) {}

  async process(
    batch: SyncLoteDto,
    identity: SyncIdentity,
  ): Promise<SyncLoteResultadoDto> {
    this.validateBatch(batch, identity);
    const results = await Promise.all(batch.operations.map(async (operation) => {
      try {
        const handler = this.registry.get(operation.operation);
        const result = await handler.handle(operation, identity);
        return this.toResult(operation.clientId, result);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'SyncClientIdCollisionError') {
          return {
            clientId: operation.clientId,
            status: 'rejected' as const,
            error: { code: 'SYNC_CLIENT_ID_COLLISION', message: 'client_id conflicts with another operation' },
          };
        }
        if (error instanceof Error && error.name === 'UnknownSyncHandlerError') {
          return {
            clientId: operation.clientId,
            status: 'rejected' as const,
            error: { code: 'SYNC_UNSUPPORTED_OPERATION', message: 'Operation is not supported' },
          };
        }
        return {
          clientId: operation.clientId,
          status: 'retryable_failure' as const,
          error: { code: 'SYNC_TEMPORARY_FAILURE', message: 'Operation could not be processed' },
        };
      }
    }));
    return { results };
  }

  private validateBatch(batch: SyncLoteDto, identity: SyncIdentity): void {
    if (!identity || typeof identity.userId !== 'string' || !identity.userId.trim()) {
      throw new InvalidSyncBatchError('Authenticated user identity is required');
    }
    if (!batch || !Array.isArray(batch.operations) || batch.operations.length === 0) {
      throw new InvalidSyncBatchError('At least one sync operation is required');
    }
    const ids = new Set<string>();
    for (const operation of batch.operations) {
      this.validateOperation(operation);
      if (ids.has(operation.clientId)) {
        throw new InvalidSyncBatchError('Duplicate clientId within batch');
      }
      ids.add(operation.clientId);
    }
  }

  private validateOperation(operation: SyncOperacionDto): void {
    if (!operation || typeof operation !== 'object') {
      throw new InvalidSyncBatchError('Sync operation must be an object');
    }
    if (typeof operation.clientId !== 'string' || !operation.clientId.trim()) {
      throw new InvalidSyncBatchError('clientId is required');
    }
    if (typeof operation.operation !== 'string' || !operation.operation.trim()) {
      throw new InvalidSyncBatchError('operation is required');
    }
    if (typeof operation.createdAt !== 'string' || !Number.isFinite(Date.parse(operation.createdAt))) {
      throw new InvalidSyncBatchError('createdAt must be a valid date');
    }
    if (!operation.payload || typeof operation.payload !== 'object' || Array.isArray(operation.payload)) {
      throw new InvalidSyncBatchError('payload must be an object');
    }
  }

  private toResult(clientId: string, result: SyncHandlerResult) {
    switch (result.status) {
      case 'confirmed':
      case 'duplicate':
        return { clientId, status: result.status } as const;
      case 'rejected':
      case 'retryable_failure':
        return {
          clientId,
          status: result.status,
          error: { code: result.code ?? 'SYNC_OPERATION_FAILED', message: result.message ?? 'Operation could not be processed' },
        } as const;
    }
  }
}
