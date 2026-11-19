import 'fake-indexeddb/auto';
// jsdom no trae structuredClone y fake-indexeddb lo necesita (mismo arreglo que offline-store.service.spec).
if (typeof globalThis.structuredClone !== 'function') {
  Object.defineProperty(globalThis, 'structuredClone', {
    value: <T>(valor: T): T => JSON.parse(JSON.stringify(valor)) as T,
    configurable: true,
    writable: true,
  });
}
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DexieDb } from '../core/offline/dexie-db';
import { DEXIE_DB_TOKEN } from '../core/offline/dexie-db-token';
import { PushService } from '../core/push/push.service';
import { AuthService } from './auth.service';
import { SesionService } from './sesion.service';

describe('AuthService.cerrarSesion', () => {
  it('cancela el push, vacía todas las tablas de Dexie (outbox incluido) y borra los tokens', async () => {
    const db = new DexieDb(`prueba-cierre-${Date.now()}`);
    const dexie = db.getDatabase();
    await dexie.table('outbox').add({ usuario: 'u1', clientId: 'c1', createdAt: '2026-11-19' });
    await dexie.table('diario').add({ usuario: 'u1', fecha: '2026-11-19' });
    const push = { cancelarSuscripcion: jest.fn().mockResolvedValue(undefined) };
    const sesion = { cerrar: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: DEXIE_DB_TOKEN, useValue: db },
        { provide: PushService, useValue: push },
        { provide: SesionService, useValue: sesion },
      ],
    });

    await TestBed.inject(AuthService).cerrarSesion();

    expect(push.cancelarSuscripcion).toHaveBeenCalled();
    expect(await Promise.all(dexie.tables.map((t) => t.count()))).toEqual(dexie.tables.map(() => 0));
    expect(sesion.cerrar).toHaveBeenCalled();
    await dexie.delete();
  });

  it('cierra la sesión aunque falle la limpieza', async () => {
    const sesion = { cerrar: jest.fn() };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: PushService, useValue: { cancelarSuscripcion: jest.fn().mockRejectedValue(new Error('sw')) } },
        { provide: SesionService, useValue: sesion },
      ],
    });
    await expect(TestBed.inject(AuthService).cerrarSesion()).rejects.toThrow('sw');
    expect(sesion.cerrar).toHaveBeenCalled();
  });
});
