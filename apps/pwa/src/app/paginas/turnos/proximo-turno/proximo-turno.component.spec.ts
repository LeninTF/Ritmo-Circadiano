import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TurnoLaboral } from '@circadiano/domain';
import { ProximoTurnoComponent } from './proximo-turno.component';
import { ProximoTurnoService } from './proximo-turno.service';

// Horas construidas en la zona del dispositivo: los tests no dependen del TZ de la máquina.
const local = (d: number, h: number, m = 0) => new Date(2026, 9, d, h, m).toISOString();

const TURNO: TurnoLaboral = {
  id: 't-1',
  idUsuario: 'u-1',
  idRuta: 'r-1',
  fecha: '2026-10-23T00:00:00.000Z',
  inicioProgramado: local(23, 8),
  finProgramado: local(23, 17),
  horasConduccion: 8,
  esNocturno: false,
  estadoConfirmacion: 'pendiente',
  horaInicioReal: null,
  horaFinReal: null,
  creadoEn: '2026-10-22T06:00:00Z',
  actualizadoEn: '2026-10-22T06:00:00Z',
};

describe('ProximoTurnoComponent (RF05)', () => {
  let component: ProximoTurnoComponent;
  let fixture: ComponentFixture<ProximoTurnoComponent>;
  let servicio: { obtenerProximoTurno: jest.Mock; confirmarTurno: jest.Mock };

  beforeEach(async () => {
    servicio = {
      obtenerProximoTurno: jest.fn().mockReturnValue(of({ ...TURNO })),
      confirmarTurno: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ProximoTurnoComponent],
      providers: [{ provide: ProximoTurnoService, useValue: servicio }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProximoTurnoComponent);
    component = fixture.componentInstance;
  });

  it('carga y muestra el turno pendiente con horas locales', () => {
    fixture.detectChanges();
    expect(component.estadoVista()).toBe('pendiente');
    expect(component.turno()?.id).toBe('t-1');
    expect(component.extraerHoraHHmm(TURNO.inicioProgramado)).toBe('08:00');
  });

  it('muestra sin_turno cuando no hay asignaciones', () => {
    servicio.obtenerProximoTurno.mockReturnValue(of(null));
    fixture.detectChanges();
    expect(component.estadoVista()).toBe('sin_turno');
  });

  it('muestra error si falla la carga', () => {
    servicio.obtenerProximoTurno.mockReturnValue(throwError(() => new Error('red')));
    fixture.detectChanges();
    expect(component.estadoVista()).toBe('error');
  });

  it('pasa el idTurno del enlace al servicio', () => {
    fixture.componentRef.setInput('idTurno', 't-9');
    fixture.detectChanges();
    expect(servicio.obtenerProximoTurno).toHaveBeenCalledWith('t-9');
  });

  it('abre y cierra el formulario de corrección precargado con las horas locales', () => {
    fixture.detectChanges();
    component.abrirCorreccion();
    expect(component.modoCorreccion()).toBe(true);
    expect(component.formCorreccion.value).toMatchObject({ horaInicio: '08:00', horaFin: '17:00' });
    component.cancelarCorreccion();
    expect(component.modoCorreccion()).toBe(false);
  });

  it('valida la coherencia temporal y pide confirmación antes de guardar', () => {
    fixture.detectChanges();
    component.abrirCorreccion();
    component.formCorreccion.setValue({ horaInicio: '17:00', horaFin: '08:00', cruzaMedianoche: false });
    component.solicitarGuardarCorreccion();
    expect(component.mensajeError()).toContain('posterior');

    component.formCorreccion.setValue({ horaInicio: '08:30', horaFin: '17:30', cruzaMedianoche: false });
    component.solicitarGuardarCorreccion();
    expect(component.solicitandoConfirmacionCorreccion()).toBe(true);
  });

  it('arma timestamps desde la hora local, también cruzando medianoche', () => {
    expect(component.construirTimestampsIso('2026-10-23T00:00:00.000Z', '22:00', '06:00', true)).toEqual({
      horaInicioRealIso: local(23, 22),
      horaFinRealIso: local(24, 6),
    });
    expect(component.validarCoherenciaTemporal('22:00', '06:00', true).esValido).toBe(true);
  });

  it('confirma contra el servidor y muestra el estado real', () => {
    servicio.confirmarTurno.mockReturnValue(of({ ...TURNO, estadoConfirmacion: 'confirmado' }));
    fixture.detectChanges();
    component.confirmarTurnoDirecto();

    expect(servicio.confirmarTurno).toHaveBeenCalledWith('t-1', { estadoConfirmacion: 'confirmado' });
    expect(component.estadoVista()).toBe('confirmado');
    expect(component.mensajeExito()).toBe('Turno confirmado.');
  });

  it('envía la corrección con horas reales y muestra el error del servidor', () => {
    servicio.confirmarTurno.mockReturnValue(throwError(() => new Error('El turno cambió mientras guardabas.')));
    fixture.detectChanges();
    component.abrirCorreccion();
    component.formCorreccion.setValue({ horaInicio: '08:30', horaFin: '17:30', cruzaMedianoche: false });
    component.ejecutarGuardarCorreccion();

    expect(servicio.confirmarTurno).toHaveBeenCalledWith('t-1', {
      estadoConfirmacion: 'corregido',
      horaInicioReal: local(23, 8, 30),
      horaFinReal: local(23, 17, 30),
    });
    expect(component.mensajeError()).toContain('cambió');
    expect(component.guardando()).toBe(false);
  });

  it('deshabilita los botones mientras guarda (sin doble envío)', () => {
    fixture.detectChanges();
    component.guardando.set(true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('button')?.disabled).toBe(true);
  });
});
