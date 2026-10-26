import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { HistorialDiaDto } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { HistorialComponent, fechaCivil } from './historial.component';
import { Chart } from 'chart.js';
import { HistorialGraficoComponent } from './historial-grafico.component';

jest.mock('chart.js', () => ({
  Chart: Object.assign(jest.fn().mockImplementation((_canvas, config) => ({
    data: config.data, update: jest.fn(), destroy: jest.fn(),
  })), { register: jest.fn() }),
}));

const dia: HistorialDiaDto = { fecha: '2026-10-25', horasSueno: 0, cafeinaResidual: null, diarioRegistrado: true, notificacionesAbiertas: 2 };
const url = `${environment.apiUrl}/historial/me`;

describe('HistorialComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HistorialComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function preparar() {
    const fixture = TestBed.createComponent(HistorialComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    const solicitud = http.expectOne(`${url}?dias=7`);
    return { fixture, http, solicitud };
  }

  it('renderiza y carga siete días por defecto sin enviar identificadores', () => {
    const { fixture, solicitud } = preparar();
    expect(fixture.nativeElement.textContent).toContain('Cargando historial');
    expect(solicitud.request.method).toBe('GET');
    expect(solicitud.request.params.keys()).toEqual(['dias']);
    solicitud.flush({ dias: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay registros');
  });

  it.each([7, 14, 30] as const)('selecciona %i días con botones accesibles', periodo => {
    const { fixture, http, solicitud } = preparar();
    solicitud.flush({ dias: [] });
    const botones = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    botones[[7, 14, 30].indexOf(periodo)].click();
    http.expectOne(`${url}?dias=${periodo}`).flush({ dias: [dia] });
    fixture.detectChanges();
    expect(botones[[7, 14, 30].indexOf(periodo)].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelector('table caption')).not.toBeNull();
  });

  it('ordena fechas civiles y muestra ceros, ausencias e indicadores', () => {
    const { fixture, solicitud } = preparar();
    solicitud.flush({ dias: [dia, { ...dia, fecha: '2026-10-24', diarioRegistrado: false }] });
    fixture.detectChanges();
    expect(fixture.componentInstance.dias()[0].fecha).toBe('2026-10-24');
    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas[1].textContent).toContain('25/10/2026');
    expect(Array.from(filas[1].querySelectorAll('td')).map(celda => (celda as HTMLElement).textContent)).toEqual(['0', 'Sin medición', 'Sí', '2']);
    expect(fixture.nativeElement.querySelectorAll('canvas[role="img"]').length).toBe(2);
    const llamadas = jest.mocked(Chart).mock.calls.slice(-2);
    llamadas.forEach(llamada => expect(llamada[1]).toMatchObject({ type: 'line' }));
    expect(llamadas.map(llamada => llamada[1].data.datasets[0].data)).toEqual([[0, 0], [null, null]]);
  });

  it('destruye ambos gráficos al cambiar de período y no crea duplicados', () => {
    const { fixture, solicitud, http } = preparar();
    jest.mocked(Chart).mockClear();
    solicitud.flush({ dias: [dia] });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(Chart).toHaveBeenCalledTimes(2);
    const anteriores = jest.mocked(Chart).mock.results.map(resultado => resultado.value);
    fixture.componentInstance.seleccionar(30);
    fixture.detectChanges();
    anteriores.forEach(instancia => expect(instancia.destroy).toHaveBeenCalledTimes(1));
    expect(fixture.nativeElement.querySelectorAll('canvas')).toHaveLength(0);
    http.expectOne(`${url}?dias=30`).flush({ dias: [{ ...dia, horasSueno: 8, cafeinaResidual: 35 }] });
    fixture.detectChanges();
    expect(Chart).toHaveBeenCalledTimes(4);
    expect(fixture.nativeElement.querySelectorAll('canvas')).toHaveLength(2);
    expect(jest.mocked(Chart).mock.calls.slice(-2).map(llamada => llamada[1].data.datasets[0].data)).toEqual([[8], [35]]);
    const actuales = jest.mocked(Chart).mock.results.slice(-2).map(resultado => resultado.value);
    fixture.destroy();
    actuales.forEach(instancia => expect(instancia.destroy).toHaveBeenCalledTimes(1));
  });

  it('muestra error y permite reintentar', () => {
    const { fixture, http, solicitud } = preparar();
    solicitud.flush(null, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    fixture.componentInstance.seleccionar(7);
    http.expectOne(`${url}?dias=7`).flush({ dias: [] });
    expect(fixture.componentInstance.error()).toBe(false);
  });

  it('cancela solicitudes anteriores y libera la suscripción al destruirse', () => {
    const { fixture, solicitud, http } = preparar();
    fixture.componentInstance.seleccionar(14);
    expect(solicitud.cancelled).toBe(true);
    const pendiente = http.expectOne(`${url}?dias=14`);
    fixture.destroy();
    expect(pendiente.cancelled).toBe(true);
  });
});

describe('Series y fechas civiles', () => {
  it('no desplaza fechas por zona horaria', () => {
    expect(fechaCivil('2026-01-01')).toBe('01/01/2026');
  });
  it('actualiza la misma instancia, conserva null y cero y destruye recursos', () => {
    TestBed.configureTestingModule({ imports: [HistorialGraficoComponent] });
    jest.mocked(Chart).mockClear();
    const fixture = TestBed.createComponent(HistorialGraficoComponent);
    fixture.componentRef.setInput('dias', [dia]);
    fixture.componentRef.setInput('campo', 'cafeinaResidual');
    fixture.componentRef.setInput('titulo', 'Cafeína residual');
    fixture.componentRef.setInput('unidad', 'mg');
    fixture.detectChanges();
    const config = jest.mocked(Chart).mock.calls[0][1];
    const instancia = jest.mocked(Chart).mock.results[0].value;
    expect(config).toMatchObject({ type: 'line' });
    expect(config.data.datasets[0]).toMatchObject({ label: 'Cafeína residual (mg)', data: [null], spanGaps: false });
    expect(instancia.data.labels).toEqual(['25/10/2026']);
    fixture.componentRef.setInput('dias', [{ ...dia, cafeinaResidual: 0 }, { ...dia, fecha: '2026-10-26', cafeinaResidual: 42 }]);
    fixture.detectChanges();
    expect(instancia.data.datasets[0].data).toEqual([0, 42]);
    expect(instancia.update).toHaveBeenCalledTimes(2);
    expect(Chart).toHaveBeenCalledTimes(1);
    fixture.destroy();
    expect(instancia.destroy).toHaveBeenCalledTimes(1);
  });
});
