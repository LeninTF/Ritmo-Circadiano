import { DestroyRef, Injectable, inject } from '@angular/core';
import { CONNECTIVITY_PROVIDER_TOKEN } from './connectivity-provider';
import { OfflineStoreService } from './offline-store.service';
import {
  CLOCK_TOKEN,
  OUTBOX_RETRY_POLICY_TOKEN,
  OUTBOX_RETRY_SCHEDULER_TOKEN,
} from './outbox-retry-policy';
import { SESSION_PROVIDER_TOKEN } from './session-provider';
import {
  SYNC_TRANSPORT_TOKEN,
  SyncTransportRequest,
  SyncTransportResponse,
} from './sync-transport';
import {
  Outbox,
  OutboxOperation,
  OutboxPayload,
} from './types/offline-schema';

export interface EnqueueOutboxInput {
  operation: OutboxOperation;
  payload: OutboxPayload;
}

@Injectable({ providedIn: 'root' })
export class OutboxService {
  private readonly store = inject(OfflineStoreService);
  private readonly session = inject(SESSION_PROVIDER_TOKEN);
  private readonly transport = inject(SYNC_TRANSPORT_TOKEN);
  private readonly connectivity = inject(CONNECTIVITY_PROVIDER_TOKEN);
  private readonly policy = inject(OUTBOX_RETRY_POLICY_TOKEN);
  private readonly clock = inject(CLOCK_TOKEN);
  private readonly scheduler = inject(OUTBOX_RETRY_SCHEDULER_TOKEN);
  private readonly destroyRef = inject(DestroyRef);
  private inFlight?: Promise<void>;
  private cancelRetry?: () => void;
  private destroyed = false;
  private readonly removeOnlineListener: () => void;

  constructor() {
    this.validatePolicy();
    this.removeOnlineListener = this.connectivity.onOnline(() => {
      void this.sync().catch(() => undefined);
    });
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.clearRetryTimer();
      this.removeOnlineListener();
    });
    this.cancelRetry = this.scheduler.schedule(() => {
      this.cancelRetry = undefined;
      if (!this.destroyed) void this.sync().catch(() => undefined);
    }, 0);
  }

  async enqueue(input: EnqueueOutboxInput): Promise<string> {
    const owner = this.getUserId();
    if (!input || !input.operation || !input.payload ||
        typeof input.payload !== 'object' || Array.isArray(input.payload)) {
      throw new Error('Invalid Outbox operation or payload');
    }
    if (this.containsSensitiveData(input.payload)) {
      throw new Error('Outbox payload contains prohibited credentials');
    }
    const clientId = crypto.randomUUID();
    await this.store.addOutbox({
      clientId,
      operation: input.operation,
      payload: input.payload,
    }, owner);
    return clientId;
  }

  sync(): Promise<void> {
    if (this.inFlight) return this.inFlight;
    this.clearRetryTimer();
    const task = this.runSync();
    this.inFlight = task;
    void task.finally(() => {
      if (this.inFlight === task) this.inFlight = undefined;
    }).catch(() => undefined);
    return task;
  }

  private async runSync(): Promise<void> {
    const owner = this.getUserId();
    if (this.destroyed || !this.connectivity.isOnline()) return;
    const operations = await this.store.getPendingOutbox(owner);
    let earliestRetry: number | undefined;

    for (const operation of operations) {
      if (!this.isSameSession(owner)) return;
      const retryAt = this.retryTime(operation);
      if (retryAt !== undefined && retryAt > this.clock.now().getTime()) {
        earliestRetry = earliestRetry === undefined
          ? retryAt
          : Math.min(earliestRetry, retryAt);
        continue;
      }
      if (!this.connectivity.isOnline()) return;
      if (!operation.operation || !operation.payload) continue;
      const request: SyncTransportRequest = {
        clientId: operation.clientId,
        operation: operation.operation,
        payload: operation.payload,
        createdAt: operation.createdAt,
      };
      if (!this.isSameSession(owner)) return;

      let response: SyncTransportResponse;
      try {
        response = await this.transport.send(request);
      } catch (error: unknown) {
        if (!this.isSameSession(owner)) return;
        const status = this.errorStatus(error);
        if (status === 401 || status === 403) return;
        if (status === 400 || status === 422) {
          await this.blockIfOwned(operation, owner, `HTTP ${status}`);
        } else if (status === undefined) {
          await this.recordTransientFailure(operation, owner, 'Transport failure');
        } else if (status === 408 || status === 429 || status >= 500) {
          await this.recordTransientFailure(operation, owner, `HTTP ${status}`);
        } else {
          await this.blockIfOwned(operation, owner, `Unclassified HTTP ${status}`);
        }
        continue;
      }

      if (!this.isSameSession(owner)) return;
      if (response.status >= 200 && response.status < 300) {
        if (response.confirmedClientId !== operation.clientId) {
          await this.blockIfOwned(operation, owner, 'Invalid confirmation');
          continue;
        }
        await this.removeIfOwned(operation, owner);
      } else if (response.status === 401 || response.status === 403) {
        return;
      } else if (response.status === 400 || response.status === 422) {
        await this.blockIfOwned(operation, owner, `HTTP ${response.status}`);
      } else if (response.status === 408 || response.status === 429 || response.status >= 500) {
        await this.recordTransientFailure(operation, owner, `HTTP ${response.status}`);
      } else {
        await this.blockIfOwned(operation, owner, `Unclassified HTTP ${response.status}`);
      }
    }
    if (!this.destroyed && this.isSameSession(owner) && this.connectivity.isOnline()) {
      const refreshed = await this.store.getPendingOutbox(owner);
      await this.scheduleNextRetry(owner, refreshed, earliestRetry);
    }
  }

  private async recordTransientFailure(
    operation: Outbox,
    owner: string,
    error: string
  ): Promise<void> {
    if (!this.isSameSession(owner)) return;
    const nextAttempts = (operation.attempts ?? 0) + 1;
    if (nextAttempts >= this.policy.maxAttempts) {
      await this.blockIfOwned(operation, owner, error, nextAttempts);
      return;
    }
    const delay = Math.min(
      this.policy.baseDelayMs * 2 ** Math.max(0, nextAttempts - 1),
      this.policy.maxDelayMs
    );
    const nextRetryAt = new Date(
      this.clock.now().getTime() + delay
    ).toISOString();
    if (!this.isSameSession(owner)) return;
    await this.store.updateOutboxRetry(
      operation.clientId,
      nextAttempts,
      nextRetryAt,
      error,
      owner
    );
  }

  private async blockIfOwned(
    operation: Outbox,
    owner: string,
    error: string,
    attempts?: number
  ): Promise<void> {
    if (!this.isSameSession(owner)) return;
    const current = await this.store.getOutboxByClientId(operation.clientId, owner);
    if (!this.isSameSession(owner) || current?.usuario !== owner) return;
    await this.store.markOutboxBlocked(operation.clientId, error, attempts, owner);
  }

  private async removeIfOwned(
    operation: Outbox,
    owner: string
  ): Promise<void> {
    if (!this.isSameSession(owner)) return;
    const current = await this.store.getOutboxByClientId(operation.clientId, owner);
    if (!this.isSameSession(owner) || current?.usuario !== owner) return;
    await this.store.removeOutbox(operation.clientId, owner);
  }

  private containsSensitiveData(
    value: unknown,
    visited: WeakSet<object> = new WeakSet<object>()
  ): boolean {
    if (typeof value === 'string') {
      return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
    }
    if (typeof value !== 'object' || value === null || visited.has(value)) {
      return false;
    }
    visited.add(value);
    if (Array.isArray(value)) {
      return value.some((item) => this.containsSensitiveData(item, visited));
    }
    return Object.entries(value).some(([key, nested]) =>
      /jwt|token|password|secret|authorization|credential/i.test(key) ||
      this.containsSensitiveData(nested, visited)
    );
  }

  private retryTime(operation: Outbox): number | undefined {
    if (!operation.nextRetryAt) return undefined;
    const retryAt = Date.parse(operation.nextRetryAt);
    return Number.isFinite(retryAt) ? retryAt : undefined;
  }

  private async scheduleNextRetry(
    owner: string,
    operations: Outbox[],
    earliestRetry: number | undefined
  ): Promise<void> {
    const now = this.clock.now().getTime();
    let nextRetry = earliestRetry;
    if (nextRetry !== undefined && nextRetry <= now) nextRetry = undefined;
    for (const operation of operations) {
      if (operation.status === 'blocked') continue;
      const retryAt = this.retryTime(operation);
      if (retryAt !== undefined && retryAt > now) {
        nextRetry = nextRetry === undefined ? retryAt : Math.min(nextRetry, retryAt);
      }
    }
    if (nextRetry === undefined) {
      this.clearRetryTimer();
      return;
    }
    this.clearRetryTimer();
    if (this.destroyed || !this.isSameSession(owner)) return;
    const delay = Math.max(0, nextRetry - this.clock.now().getTime());
    this.cancelRetry = this.scheduler.schedule(() => {
      this.cancelRetry = undefined;
      if (!this.destroyed) void this.sync().catch(() => undefined);
    }, delay);
  }

  private clearRetryTimer(): void {
    this.cancelRetry?.();
    this.cancelRetry = undefined;
  }

  private isSameSession(owner: string): boolean {
    try {
      return this.getUserId() === owner;
    } catch {
      return false;
    }
  }

  private getUserId(): string {
    const user = this.session.getUserId();
    if (typeof user !== 'string' || !user.trim()) {
      throw new Error('Unauthenticated: invalid user ID');
    }
    return user;
  }

  private errorStatus(error: unknown): number | undefined {
    if (typeof error !== 'object' || error === null || !('status' in error)) {
      return undefined;
    }
    const status = error.status;
    return typeof status === 'number' ? status : undefined;
  }

  private validatePolicy(): void {
    if (
      !Number.isFinite(this.policy.baseDelayMs) || this.policy.baseDelayMs < 0 ||
      !Number.isFinite(this.policy.maxDelayMs) || this.policy.maxDelayMs < 0 ||
      !Number.isInteger(this.policy.maxAttempts) || this.policy.maxAttempts < 1
    ) {
      throw new Error('Invalid Outbox retry policy');
    }
  }
}
