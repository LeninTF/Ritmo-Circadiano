import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProximoTurnoComponent } from './proximo-turno.component';
import { ProximoTurnoService } from './proximo-turno.service';
import { DEMO_PROXIMO_TURNO, DEMO_TURNO_NOCTURNO } from './proximo-turno.models';

describe('ProximoTurnoComponent (RF05)', () => {
  let component: ProximoTurnoComponent;
  let fixture: ComponentFixture<ProximoTurnoComponent>;
  let service: ProximoTurnoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximoTurnoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), ProximoTurnoService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProximoTurnoComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProximoTurnoService);
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar y renderizar el próximo turno pendiente', () => {
    service.setTurnoDemo({ ...DEMO_PROXIMO_TURNO });
    component.cargarTurno();
    fixture.detectChanges();

    expect(component.estadoVista()).toBe('pendiente');
    expect(component.turno()).toBeTruthy();
    expect(component.turno()?.id).toBe(DEMO_PROXIMO_TURNO.id);
  });

  it('debe mostrar el estado sin turno cuando no hay asignaciones', () => {
    service.setTurnoDemo(null);
    component.cargarTurno();
    fixture.detectChanges();

    expect(component.estadoVista()).toBe('sin_turno');
  });

  it('debe abrir y cerrar el formulario de corrección', () => {
    service.setTurnoDemo({ ...DEMO_PROXIMO_TURNO });
    component.cargarTurno();
    fixture.detectChanges();

    expect(component.modoCorreccion()).toBe(false);
    component.abrirCorreccion();
    fixture.detectChanges();
    expect(component.modoCorreccion()).toBe(true);

    component.cancelarCorreccion();
    fixture.detectChanges();
    expect(component.modoCorreccion()).toBe(false);
  });

  it('debe validar la coherencia temporal y requerir confirmación previa', () => {
    service.setTurnoDemo({ ...DEMO_PROXIMO_TURNO });
    component.cargarTurno();
    component.abrirCorreccion();
    fixture.detectChanges();

    component.formCorreccion.setValue({ horaInicio: '17:00', horaFin: '08:00', cruzaMedianoche: false });
    component.solicitarGuardarCorreccion();
    fixture.detectChanges();
    expect(component.mensajeError()).toContain('posterior');

    component.formCorreccion.setValue({ horaInicio: '08:30', horaFin: '17:30', cruzaMedianoche: false });
    component.solicitarGuardarCorreccion();
    fixture.detectChanges();
    expect(component.solicitandoConfirmacionCorreccion()).toBe(true);
  });

  it('debe permitir turnos que cruzan medianoche correctamente', () => {
    service.setTurnoDemo({ ...DEMO_TURNO_NOCTURNO });
    component.cargarTurno();
    component.abrirCorreccion();
    fixture.detectChanges();

    component.formCorreccion.setValue({ horaInicio: '22:00', horaFin: '06:00', cruzaMedianoche: true });
    const val = component.validarCoherenciaTemporal('22:00', '06:00', true);
    expect(val.esValido).toBe(true);

    const ts = component.construirTimestampsIso('2026-10-23', '22:00', '06:00', true);
    expect(ts.horaInicioRealIso).toContain('2026-10-23T22:00:00');
    expect(ts.horaFinRealIso).toContain('2026-10-24T06:00:00');
  });

  it('debe prevenir doble envío deshabilitando el botón mientras guarda', () => {
    service.setTurnoDemo({ ...DEMO_PROXIMO_TURNO });
    component.cargarTurno();
    component.guardando.set(true);
    fixture.detectChanges();

    const btn = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(btn?.disabled).toBe(true);
  });

  it('debe confirmar el turno directamente con éxito', () => {
    service.setTurnoDemo({ ...DEMO_PROXIMO_TURNO });
    component.cargarTurno();
    component.confirmarTurnoDirecto();
    fixture.detectChanges();

   expect(component.estadoVista()).toBe('confirmado');
expect(component.mensajeExito()).toContain('Confirmación simulada');
expect(component.mensajeExito()).toContain(
  'Los cambios no se guardaron en el servidor',
);
  });

  it('debe manejar errores de carga correctamente', () => {
    service.setForzarError(true);
    component.cargarTurno();
    fixture.detectChanges();

    expect(component.estadoVista()).toBe('error');
  });

  it('debe aceptar input idTurno para enlace directo (deep link)', () => {
  fixture.componentRef.setInput(
    'idTurno',
    DEMO_TURNO_NOCTURNO.id,
  );

  fixture.detectChanges();
  component.cargarTurno();
  fixture.detectChanges();

  expect(component.turno()?.id).toBe(
    DEMO_TURNO_NOCTURNO.id,
  );
});
});
