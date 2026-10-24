
import { InjectionToken } from '@angular/core';
import { DexieDb } from './dexie-db';

export const DEXIE_DB_TOKEN = new InjectionToken<DexieDb>(
  'DEXIE_DB_TOKEN',
  {
    providedIn: 'root',
    factory: () => new DexieDb(),
  }
);
