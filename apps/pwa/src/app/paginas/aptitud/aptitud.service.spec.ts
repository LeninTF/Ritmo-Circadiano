import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import type { TurnoLaboral } from '@circadiano/domain';
import { environment } from '../../../environments/environment';
import { AptitudService, fechaLocal } from './aptitud.service';

// Horas construidas en la zona del dispositivo: los tests no dependen del TZ de la máquina.
const AHORA = new Date(2026, 9, 24, 6, 0);
const turno = (id: string, inicio: Date) => ({ id, inicioProgramado: inicio.toISOString() }) as TurnoLaboral;

describe('AptitudService (PWA, RF12)', () => {
  let servicio: AptitudService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(AptitudService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fechaLocal usa los componentes locales, no UTC', () => {
    expect(fechaLocal(new Date(2026, 9, 24, 23, 30))).toBe('2026-10-24');
    expect(fechaLocal(new Date(2026, 0, 5, 0, 10))).toBe('2026-01-05');
  });

  it('obtenerTurnoParaEvaluar: primer turno que empieza después de ahora y dentro de 12 h', async () => {
    const resultado = firstValueFrom(servicio.obtenerTurnoParaEvaluar(AHORA));
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/operaciones/turnos/me`);
    expect(req.request.params.get('desde')).toBe('2026-10-23');
    req.flush([
      turno('ya-empezo', new Date(2026, 9, 24, 5, 0)),
      turno('en-2h', new Date(2026, 9, 24, 8, 0)),
      turno('en-4h', new Date(2026, 9, 24, 10, 0)),
    ]);
    await expect(resultado).resolves.toMatchObject({ id: 'en-2h' });
  });

  it('obtenerTurnoParaEvaluar: null si el siguiente empieza en más de 12 h', async () => {
    const resultado = firstValueFrom(servicio.obtenerTurnoParaEvaluar(AHORA));
    http
      .expectOne((r) => r.url === `${environment.apiUrl}/operaciones/turnos/me`)
      .flush([turno('lejano', new Date(2026, 9, 24, 18, 1))]);
    await expect(resultado).resolves.toBeNull();
  });

  it('crearAptitud hace POST a apiUrl/aptitud/:idTurno', () => {
    servicio.crearAptitud('t-1', { somnolencia: 3, compartido: true }).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/aptitud/t-1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ somnolencia: 3, compartido: true });
    req.flush({ color: 'verde', horasSueno24h: 8, motivos: ['sueno_suficiente'] });
  });

  it('consultarDespacho omite codigo cuando no se filtra', () => {
    servicio.consultarDespacho({ fecha: '2026-10-24' }).subscribe();
    servicio.consultarDespacho({ fecha: '2026-10-24', codigo: 'P01' }).subscribe();
    const [todos, filtrado] = http.match((r) => r.url === `${environment.apiUrl}/aptitud/despacho`);
    expect(todos.request.params.keys()).toEqual(['fecha']);
    expect(filtrado.request.params.get('codigo')).toBe('P01');
    todos.flush({ evaluaciones: [] });
    filtrado.flush({ evaluaciones: [] });
  });
});
