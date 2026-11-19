import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import type { Rol } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { SesionService } from '../../auth/sesion.service';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { TurnosComponent } from './turnos.component';

const api = `${environment.apiUrl}/operaciones`;
const T01 = { id: '11111111-1111-4111-8111-111111111111', codigoParticipante: 'T01', cargo: 'Conductor' };
const RUTA = { id: '22222222-2222-4222-8222-222222222222', origen: 'Ica', destino: 'Lima', duracionEstimadaHoras: 4, activa: true };

function crear(rol: Rol) {
  TestBed.configureTestingModule({
    imports: [TurnosComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: SesionService, useValue: { rol: signal(rol) } },
      { provide: OfflineStoreService, useValue: { addTurno: jest.fn(), getMyTurnos: jest.fn().mockResolvedValue([]) } },
    ],
  });
  const fixture = TestBed.createComponent(TurnosComponent);
  fixture.detectChanges();
  return { fixture, http: TestBed.inject(HttpTestingController), el: fixture.nativeElement as HTMLElement };
}

describe('TurnosComponent (RF04, RF14)', () => {
  it('el jefe elige trabajador y ruta de listas, no escribe UUIDs', () => {
    const { fixture, http, el } = crear('jefe_operaciones');
    http.expectOne(`${api}/rutas`).flush([RUTA]);
    http.expectOne(`${api}/trabajadores`).flush([T01]);
    const consulta = http.expectOne((r) => r.url === `${api}/turnos`);
    expect(consulta.request.params.has('desde')).toBe(true);
    expect(consulta.request.params.has('hasta')).toBe(true);
    consulta.flush([]);
    fixture.detectChanges();
    expect(el.textContent).toContain('T01 · Conductor');
    expect(el.querySelector('input:not([type])')).toBeNull();
    http.verify();
  });

  it('el trabajador consulta solo /turnos/me y no ve Nuevo ni Importar', () => {
    const { fixture, http, el } = crear('trabajador');
    http.expectOne((r) => r.url === `${api}/turnos/me`).flush([]);
    http.expectNone(`${api}/trabajadores`);
    fixture.detectChanges();
    expect(el.textContent).not.toContain('Nuevo');
    expect(el.textContent).not.toContain('Importar');
    http.verify();
  });

  it('409 de RN01: pide motivo y confirmación y reenvía con confirmarExceso', () => {
    const { fixture, http, el } = crear('jefe_operaciones');
    http.expectOne(`${api}/rutas`).flush([RUTA]);
    http.expectOne(`${api}/trabajadores`).flush([T01]);
    http.expectOne((r) => r.url === `${api}/turnos`).flush([]);
    const c = fixture.componentInstance as unknown as {
      abrirNuevo(): void;
      guardar(): void;
      form: { patchValue(v: object): void };
    };
    c.abrirNuevo();
    c.form.patchValue({ idUsuario: T01.id, idRuta: RUTA.id, fecha: '2026-11-20', horaInicio: '08:00', horaFin: '14:00', horasConduccion: 6 });
    c.guardar();
    const primero = http.expectOne((r) => r.method === 'POST');
    expect(primero.request.body).toMatchObject({ inicioProgramado: '2026-11-20T13:00:00.000Z', esNocturno: false });
    expect(primero.request.body).not.toHaveProperty('confirmarExceso');
    primero.flush(
      { requiereConfirmacion: true, superaContinuo: true, horasConduccionTurno: 6, limiteContinuoMax: 5 },
      { status: 409, statusText: 'Conflict' },
    );
    fixture.detectChanges();
    expect(el.textContent).toContain('6 h continuas; el máximo es 5 h');
    const enviar = el.querySelector<HTMLButtonElement>('button[type=submit]');
    expect(enviar?.disabled).toBe(true);

    c.form.patchValue({ motivoExceso: 'Relevo ausente', confirmarExceso: true });
    fixture.detectChanges();
    expect(enviar?.disabled).toBe(false);
    c.guardar();
    const segundo = http.expectOne((r) => r.method === 'POST');
    expect(segundo.request.body).toMatchObject({ confirmarExceso: true, motivoExceso: 'Relevo ausente' });
    segundo.flush({});
    http.expectOne((r) => r.url === `${api}/turnos`).flush([]);
    http.verify();
  });
});
