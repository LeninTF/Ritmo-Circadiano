export interface Plan {
  id?: number;
  fecha: string;
  usuario: string;
  data?: unknown;
}

export interface EventoSolar {
  id?: number;
  fecha: string;
  usuario: string;
  data?: unknown;
}

export interface Turno {
  id?: number;
  fecha: string;
  usuario: string;
  data?: unknown;
}

export interface Ingesta {
  id?: number;
  fecha: string;
  usuario: string;
  data?: unknown;
}

export interface Diario {
  id?: number;
  fecha: string;
  usuario: string;
  data?: unknown;
}

export type OutboxStatus = 'pending' | 'syncing' | 'blocked' | 'failed';

export type OutboxOperation =
  | 'plan'
  | 'eventoSolar'
  | 'turno'
  | 'ingesta'
  | 'diario'
  | 'custom';

export type OutboxPayload = Readonly<Record<string, unknown>>;

export interface Outbox {
  id?: number;
  clientId: string;
  usuario: string;
  createdAt: string;
  status?: OutboxStatus;
  attempts?: number;
  nextRetryAt?: string;
  lastError?: string;
  operation?: OutboxOperation;
  payload?: OutboxPayload;
  data?: unknown;
}
