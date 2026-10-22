import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProximoTurnoService } from './proximo-turno.service';
import { DEMO_PROXIMO_TURNO, DEMO_TURNO_NOCTURNO } from './proximo-turno.models';

describe('ProximoTurnoService', () => {
  let service: ProximoTurnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProximoTurnoService],
    });
    service = TestBed.inject(ProximoTurnoService);
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener el turno demo por defecto', (done) => {
    service.setTurnoDemo(DEMO_PROXIMO_TURNO);
    service.obtenerProximoTurno().subscribe((turno) => {
      expect(turno).toBeTruthy();
      expect(turno?.id).toBe(DEMO_PROXIMO_TURNO.id);
      done();
    });
  });

  it('debe obtener el turno nocturno al pasar idTurno específico', (done) => {
    service.obtenerProximoTurno(DEMO_TURNO_NOCTURNO.id).subscribe((turno) => {
      expect(turno).toBeTruthy();
      expect(turno?.id).toBe(DEMO_TURNO_NOCTURNO.id);
      expect(turno?.esNocturno).toBe(true);
      done();
    });
  });

  it('debe confirmar el turno correctamente en modo demo', (done) => {
    service.setTurnoDemo(DEMO_PROXIMO_TURNO);
    service
      .confirmarTurno(DEMO_PROXIMO_TURNO.id, { estadoConfirmacion: 'confirmado' })
      .subscribe((res) => {
        expect(res.estadoConfirmacion).toBe('confirmado');
        done();
      });
  });

  it('debe corregir el turno correctamente en modo demo', (done) => {
    service.setTurnoDemo(DEMO_PROXIMO_TURNO);
    service
      .confirmarTurno(DEMO_PROXIMO_TURNO.id, {
        estadoConfirmacion: 'corregido',
        horaInicioReal: '2026-10-23T08:30:00.000Z',
        horaFinReal: '2026-10-23T17:30:00.000Z',
      })
      .subscribe((res) => {
        expect(res.estadoConfirmacion).toBe('corregido');
        expect(res.horaInicioReal).toBe('2026-10-23T08:30:00.000Z');
        expect(res.horaFinReal).toBe('2026-10-23T17:30:00.000Z');
        done();
      });
  });
});
