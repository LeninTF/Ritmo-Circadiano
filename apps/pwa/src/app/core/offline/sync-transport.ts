import { InjectionToken } from '@angular/core';
import {
  OutboxOperation,
  OutboxPayload,
} from './types/offline-schema';

export interface SyncTransportRequest {
  clientId: string;
  operation: OutboxOperation;
  payload: OutboxPayload;
  createdAt: string;
}

export interface SyncTransportResponse {
  status: number;
  confirmedClientId?: string;
}

export interface ISyncTransport {
  send(request: SyncTransportRequest): Promise<SyncTransportResponse>;
}

export const SYNC_TRANSPORT_TOKEN = new InjectionToken<ISyncTransport>(
  'SYNC_TRANSPORT_TOKEN'
);
