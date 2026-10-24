import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import type { PlanDiarioDto } from '@circadiano/contracts';
import type { TurnoLaboral } from '@circadiano/domain';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { ProximoTurnoService } from '../turnos/proximo-turno/proximo-turno.service';
import { PlanService } from './plan.service';

const sinRed = () => throwError(() => new HttpErrorResponse({ status: 0 }));

// Turno nocturno 22:00-05:00 en Lima del 24-oct-2026.
const turno: TurnoLaboral = {
  id: 't-1',
  idUsuario: 'u-1',
  idRuta: 'r-1',
  fecha: '2026-10-24',
  inicioProgramado: '2026-10-25T03:00:00Z',
  finProgramado: '2026-10-25T10:00:00Z',
  horasConduccion: 4,
  esNocturno: true,
  estadoConfirmacion: 'pendiente',
  horaInicioReal: null,
  horaFinReal: null,
  creadoEn: '2026-10-20T00:00:00Z',
  actualizadoEn: '2026-10-20T00:00:00Z',
};
const planServidor = { id: 'p-1', idTurno: 't-1', fecha: '2026-10-24', categoriaCronotipo: 'intermedio' } as PlanDiarioDto;

describe('PlanService (RF07, RNF03)', () => {
  const http = { post: jest.fn(), get: jest.fn() };
  const turnos = { obtenerProximoTurno: jest.fn() };
  const offline = {
    addPlan: jest.fn(),
    addTurno: jest.fn(),
    addEventoSolar: jest.fn(),
    getMyPlans: jest.fn(),
    getMyTurnos: jest.fn(),
    getMyEventosSolares: jest.fn(),
  };
  const ahora = new Date('2026-10-24T20:00:00Z');
  let servicio: PlanService;

  beforeEach(() => {
    jest.resetAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: ProximoTurnoService, useValue: turnos },
        { provide: OfflineStoreService, useValue: offline },
      ],
    });
    servicio = TestBed.inject(PlanService);
    offline.getMyEventosSolares.mockResolvedValue([]);
  });

  it('con conexión genera el plan del próximo turno y guarda turnos y eventos para offline', async () => {
    turnos.obtenerProximoTurno.mockReturnValue(of(turno));
    http.post.mockReturnValue(of(planServidor));
    http.get.mockImplementation((url: string) =>
      url.endsWith('/eventos-solares')
        ? throwError(() => new HttpErrorResponse({ status: 404 }))
        : of([turno]),
    );

    const resultado = await servicio.obtenerPlanDelDia(ahora);

    expect(http.post).toHaveBeenCalledWith(expect.stringMatching(/\/planes\/generar$/), { idTurno: 't-1' });
    expect(offline.addPlan).toHaveBeenCalledWith({ fecha: '2026-10-24', data: planServidor });
    expect(offline.addTurno).toHaveBeenCalledWith({ fecha: '2026-10-24', data: turno });
    expect(resultado).toEqual({ plan: planServidor, origen: 'servidor', sinUbicacion: true });
  });

  it('sin turnos próximos devuelve null', async () => {
    turnos.obtenerProximoTurno.mockReturnValue(of(null));
    await expect(servicio.obtenerPlanDelDia(ahora)).resolves.toBeNull();
  });

  it('sin conexión usa el plan del servidor guardado para ese turno', async () => {
    turnos.obtenerProximoTurno.mockReturnValue(sinRed());
    offline.getMyTurnos.mockResolvedValue([{ fecha: turno.fecha, data: turno }]);
    offline.getMyPlans.mockResolvedValue([{ fecha: turno.fecha, data: planServidor }]);

    await expect(servicio.obtenerPlanDelDia(ahora)).resolves.toEqual({ plan: planServidor, origen: 'guardado' });
  });

  it('sin conexión y sin plan guardado lo calcula en el teléfono en ≤ 200 ms (RNF01)', async () => {
    turnos.obtenerProximoTurno.mockReturnValue(sinRed());
    offline.getMyTurnos.mockResolvedValue([{ fecha: turno.fecha, data: turno }]);
    offline.getMyPlans.mockResolvedValue([]);

    const resultado = await servicio.obtenerPlanDelDia(ahora);

    expect(resultado?.origen).toBe('calculado');
    expect(resultado?.duracionMs).toBeLessThan(200);
    expect(resultado?.plan).toMatchObject({
      idTurno: 't-1',
      tipoTurno: 'nocturno',
      inicioSueno: '2026-10-25T11:00:00.000Z',
      finSueno: '2026-10-25T18:30:00.000Z',
      protegerLuz: true,
    });
  });

  it('un error del servidor distinto a "sin conexión" se propaga', async () => {
    turnos.obtenerProximoTurno.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    await expect(servicio.obtenerPlanDelDia(ahora)).rejects.toBeInstanceOf(HttpErrorResponse);
  });
});
