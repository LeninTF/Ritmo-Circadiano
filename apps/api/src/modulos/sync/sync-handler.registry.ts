import {
  SyncOperationHandler,
} from '@circadiano/contracts';

export class UnknownSyncHandlerError extends Error {
  constructor(operation: string) {
    super(`Unknown sync operation: ${operation}`);
    this.name = 'UnknownSyncHandlerError';
  }
}

export class SyncHandlerRegistry {
  private readonly handlers: ReadonlyMap<string, SyncOperationHandler>;

  constructor(handlers: readonly SyncOperationHandler[]) {
    const registry = new Map<string, SyncOperationHandler>();
    for (const handler of handlers) {
      if (registry.has(handler.operation)) {
        throw new Error(`Duplicate sync handler: ${handler.operation}`);
      }
      registry.set(handler.operation, handler);
    }
    this.handlers = registry;
  }

  get(operation: string): SyncOperationHandler {
    const handler = this.handlers.get(operation);
    if (!handler) throw new UnknownSyncHandlerError(operation);
    return handler;
  }

  has(operation: string): boolean {
    return this.handlers.has(operation);
  }
}
