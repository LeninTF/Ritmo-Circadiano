import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { TurnoLaboral } from '@circadiano/domain';
import { environment } from '../../../../environments/environment';
import { ProximoTurnoService } from './proximo-turno.service';

const URL = `${environment.apiUrl}/operaciones/turnos`;
const turno = (id: string, inicio: string, fin: string, estado: TurnoLaboral['estadoConfirmacion'] = 'pendiente'): TurnoLaboral => ({
  id,
  idUsuario: 'u-1',
  idRuta: 'r-1',
  fecha: inicio.slice(0, 10),
  inicioProgramado: inicio,
  finProgramado: fin,
  horasConduccion: 4,
  esNocturno: false,
  estadoConfirmacion: estado,
  horaInicioReal: null,
  horaFinReal: null,
  creadoEn: '2026-10-20T00:00:00Z',
  actualizadoEn: '2026-10-20T00:00:00Z',
});

describe('ProximoTurnoService (RF05)', () => {
  let service: ProximoTurnoService;
  let http: HttpTestingController;
  const ahora = new Date('2026-10-24T15:00:00Z');

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProximoTurnoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('pide /turnos/me desde ayer y prioriza el último turno iniciado que sigue pendiente', async () => {
    const resultado = firstValueFrom(service.obtenerProximoTurno(null, ahora));
    const req = http.expectOne((r) => r.url === `${URL}/me`);
    expect(req.request.params.get('desde')).toMatch(/^2026-10-2[23]$/);
    req.flush([
      turno('viejo', '2026-10-23T08:00:00Z', '2026-10-23T12:00:00Z', 'confirmado'),
      turno('recien', '2026-10-24T08:00:00Z', '2026-10-24T12:00:00Z'),
      turno('futuro', '2026-10-25T08:00:00Z', '2026-10-25T12:00:00Z'),
    ]);
    expect((await resultado)?.id).toBe('recien');
  });

  it('sin pendientes iniciados devuelve el próximo por terminar, o null', async () => {
    const proximo = firstValueFrom(service.obtenerProximoTurno(null, ahora));
    http.expectOne((r) => r.url === `${URL}/me`).flush([
      turno('hecho', '2026-10-24T08:00:00Z', '2026-10-24T12:00:00Z', 'confirmado'),
      turno('futuro', '2026-10-25T08:00:00Z', '2026-10-25T12:00:00Z'),
    ]);
    expect((await proximo)?.id).toBe('futuro');

    const ninguno = firstValueFrom(service.obtenerProximoTurno(null, ahora));
    http.expectOne((r) => r.url === `${URL}/me`).flush([]);
    expect(await ninguno).toBeNull();
  });

  it('con idTurno (enlace del aviso) devuelve ese turno sin filtrar por fecha', async () => {
    const resultado = firstValueFrom(service.obtenerProximoTurno('futuro', ahora));
    const req = http.expectOne((r) => r.url === `${URL}/me`);
    expect(req.request.params.has('desde')).toBe(false);
    req.flush([turno('futuro', '2026-10-25T08:00:00Z', '2026-10-25T12:00:00Z')]);
    expect((await resultado)?.id).toBe('futuro');
  });

  it('confirma con PATCH /:id/confirmacion y devuelve el turno del servidor', async () => {
    const resultado = firstValueFrom(service.confirmarTurno('t-1', { estadoConfirmacion: 'confirmado' }));
    const req = http.expectOne(`${URL}/t-1/confirmacion`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estadoConfirmacion: 'confirmado' });
    req.flush(turno('t-1', '2026-10-24T08:00:00Z', '2026-10-24T12:00:00Z', 'confirmado'));
    expect((await resultado).estadoConfirmacion).toBe('confirmado');
  });

  it.each([
    [409, 'cambió mientras guardabas'],
    [403, 'no está asignado a ti'],
    [500, 'No se pudo guardar'],
  ])('traduce HTTP %i a un mensaje para el trabajador', async (status, mensaje) => {
    const resultado = firstValueFrom(service.confirmarTurno('t-1', { estadoConfirmacion: 'confirmado' }));
    http.expectOne(`${URL}/t-1/confirmacion`).flush(null, { status, statusText: 'x' });
    await expect(resultado).rejects.toThrow(mensaje);
  });
});
