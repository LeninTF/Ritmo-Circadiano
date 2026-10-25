import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import type { CrearAptitudResponse } from '@circadiano/contracts';
import type { TurnoLaboral } from '@circadiano/domain';
import { environment } from '../../../environments/environment';
import { AptitudComponent } from './aptitud.component';

const HORA_MS = 60 * 60 * 1000;
const URL_TURNOS = `${environment.apiUrl}/operaciones/turnos/me`;

/** Turno que empieza `horas` despues del reloj real (puede ser negativo). */
const turno = (id: string, horas: number): TurnoLaboral => {
  const inicio = new Date(Date.now() + horas * HORA_MS);
  return {
    id,
    idUsuario: 'u-1',
    idRuta: 'r-1',
    fecha: inicio.toISOString(),
    inicioProgramado: inicio.toISOString(),
    finProgramado: new Date(inicio.getTime() + 8 * HORA_MS).toISOString(),
    horasConduccion: 4,
    esNocturno: false,
    estadoConfirmacion: 'pendiente',
    horaInicioReal: null,
    horaFinReal: null,
    creadoEn: inicio.toISOString(),
    actualizadoEn: inicio.toISOString(),
  };
};

describe('AptitudComponent (RF12, CP-12)', () => {
  let fixture: ComponentFixture<AptitudComponent>;
  let http: HttpTestingController;

  const pagina = () => fixture.nativeElement as HTMLElement;
  const texto = () => pagina().textContent ?? '';
  const boton = (etiqueta: string) =>
    [...pagina().querySelectorAll('button')].find((b) => b.textContent?.trim() === etiqueta) as HTMLButtonElement;
  const slider = () => pagina().querySelector<HTMLInputElement>('#somnolencia') as HTMLInputElement;
  const estabilizar = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const responderTurnos = async (turnos: TurnoLaboral[]) => {
    http.expectOne((r) => r.method === 'GET' && r.url === URL_TURNOS).flush(turnos);
    await estabilizar();
  };
  const irAlAutorreporte = async () => {
    await responderTurnos([turno('t-pasado', -1), turno('t-1', 2)]);
    boton('Continuar').click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AptitudComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AptitudComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('turno próximo → elige somnolencia → envía → muestra color, horas y motivos de la API', async () => {
    await responderTurnos([turno('t-pasado', -1), turno('t-1', 2), turno('t-2', 5)]);
    expect(texto()).toContain('Empieza a las');
    expect(pagina().querySelector('a[href="/diario"]')).not.toBeNull();

    boton('Continuar').click();
    fixture.detectChanges();

    // Sin elección explícita no se puede enviar.
    expect(boton('Ver resultado').disabled).toBe(true);
    expect(slider().getAttribute('aria-valuetext')).toBe('Sin elegir');

    slider().value = '2';
    slider().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(slider().getAttribute('aria-valuetext')).toBe('2 de 5: Alerta');

    boton('Ver resultado').click();
    const post = http.expectOne(`${environment.apiUrl}/aptitud/t-1`);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual({ somnolencia: 2, compartido: false });
    const respuesta: CrearAptitudResponse = { color: 'ambar', horasSueno24h: 6.3, motivos: ['sueno_intermedio'] };
    post.flush(respuesta);
    await estabilizar();

    expect(texto()).toContain('APTO CON MEDIDAS');
    expect(texto()).toContain('6,3 h');
    expect(texto()).toContain('Dormiste entre 5 y 7 h');
  });

  it('sin turno en las próximas 12 h → mensaje y sin POST', async () => {
    await responderTurnos([turno('t-pasado', -1), turno('t-lejano', 13)]);

    expect(texto()).toContain('No tienes un turno en las próximas 12 h');
    expect(boton('Continuar')).toBeUndefined();
    http.expectNone((r) => r.method === 'POST');
  });

  it('compartido es falso por defecto y el toque sobre el slider confirma el valor en el que está', async () => {
    await irAlAutorreporte();
    expect(pagina().querySelector<HTMLInputElement>('#compartido')?.checked).toBe(false);

    slider().dispatchEvent(new Event('pointerup'));
    fixture.detectChanges();
    expect(slider().getAttribute('aria-valuetext')).toBe('3 de 5: Normal');
    expect(boton('Ver resultado').disabled).toBe(false);
  });

  it('403 al enviar → mensaje y sigue en el autorreporte', async () => {
    await irAlAutorreporte();
    slider().dispatchEvent(new Event('pointerup'));
    fixture.detectChanges();

    boton('Ver resultado').click();
    http.expectOne(`${environment.apiUrl}/aptitud/t-1`).flush(null, { status: 403, statusText: 'Forbidden' });
    await estabilizar();

    expect(texto()).toContain('Este turno no está asignado a ti.');
    expect(boton('Ver resultado')).toBeDefined();
  });
});
