import { InjectionToken } from '@angular/core';

export interface OutboxRetryPolicy {
  baseDelayMs: number;
  maxDelayMs: number;
  maxAttempts: number;
}

export interface IClock {
  now(): Date;
}

export interface IOutboxRetryScheduler {
  schedule(callback: () => void, delayMs: number): () => void;
}

export const OUTBOX_RETRY_SCHEDULER_TOKEN =
  new InjectionToken<IOutboxRetryScheduler>('OUTBOX_RETRY_SCHEDULER_TOKEN', {
    providedIn: 'root',
    factory: (): IOutboxRetryScheduler => ({
      schedule: (callback: () => void, delayMs: number): (() => void) => {
        const handle = globalThis.setTimeout(callback, delayMs);
        return (): void => globalThis.clearTimeout(handle);
      },
    }),
  });

export const OUTBOX_RETRY_POLICY_TOKEN = new InjectionToken<OutboxRetryPolicy>(
  'OUTBOX_RETRY_POLICY_TOKEN',
  {
    providedIn: 'root',
    factory: (): OutboxRetryPolicy => ({
      baseDelayMs: 1_000,
      maxDelayMs: 300_000,
      maxAttempts: 5,
    }),
  }
);

export const CLOCK_TOKEN = new InjectionToken<IClock>('CLOCK_TOKEN', {
  providedIn: 'root',
  factory: (): IClock => ({
    now: (): Date => new Date(),
  }),
});
