import 'fake-indexeddb/auto';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { SesionService } from '../../auth/sesion.service';
import { crearJwtPrueba } from '../../auth/token-prueba';
import { OutboxService } from './outbox.service';
import { proveerOffline } from './proveedores-offline';
import { SESSION_PROVIDER_TOKEN } from './session-provider';
import { SYNC_TRANSPORT_TOKEN, SyncTransportRequest } from './sync-transport';

const OPERACION: SyncTransportRequest = {
  clientId: '7f1c6a2e-0000-4000-8000-000000000001',
  operation: 'diario',
  payload: { fecha: '2026-10-23' },
  createdAt: '2026-10-23T10:00:00.000Z',
};

describe('proveerOffline', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), proveerOffline()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('permite inyectar OutboxService con sus dependencias', () => {
    expect(TestBed.inject(OutboxService)).toBeInstanceOf(OutboxService);
  });

  it('toma el usuario del sub del token y falla sin sesion', () => {
    const sesionOffline = TestBed.inject(SESSION_PROVIDER_TOKEN);
    expect(() => sesionOffline.getUserId()).toThrow();

    const token = crearJwtPrueba({ sub: 'usuario-1', rol: 'trabajador' });
    TestBed.inject(SesionService).iniciar({ accessToken: token, refreshToken: token, expiraEnSegundos: 3600 });
    expect(sesionOffline.getUserId()).toBe('usuario-1');
  });

  it.each([
    ['confirmed', 200],
    ['duplicate', 200],
    ['rejected', 422],
    ['retryable_failure', 503],
  ])('traduce %s del lote a HTTP %i', async (estado, status) => {
    const envio = TestBed.inject(SYNC_TRANSPORT_TOKEN).send(OPERACION);
    const req = http.expectOne(`${environment.apiUrl}/sync/lote`);
    expect(req.request.body.operations[0].client_id).toBe(OPERACION.clientId);
    req.flush({ results: [{ client_id: OPERACION.clientId, status: estado }] });
    await expect(envio).resolves.toEqual({ status, confirmedClientId: OPERACION.clientId });
  });

  it('sin red lanza un error sin status (reintento) y con error HTTP conserva el status', async () => {
    const transporte = TestBed.inject(SYNC_TRANSPORT_TOKEN);

    const sinRed = transporte.send(OPERACION);
    http.expectOne(`${environment.apiUrl}/sync/lote`).error(new ProgressEvent('error'));
    await expect(sinRed).rejects.not.toBeInstanceOf(HttpErrorResponse);

    const prohibido = transporte.send(OPERACION);
    http.expectOne(`${environment.apiUrl}/sync/lote`).flush(null, { status: 403, statusText: 'Forbidden' });
    await expect(prohibido).rejects.toMatchObject({ status: 403 });
  });
});
