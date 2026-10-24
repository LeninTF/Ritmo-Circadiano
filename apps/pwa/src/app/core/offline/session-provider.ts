import { InjectionToken } from '@angular/core';

export interface ISessionProvider {
  /** Returns the authenticated user id or throws if no session exists */
  getUserId(): string;
}

export const SESSION_PROVIDER_TOKEN = new InjectionToken<ISessionProvider>('SESSION_PROVIDER_TOKEN');
