import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { HistorialDiaDto } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { HistorialComponent, fechaCivil } from './historial.component';
import { Chart } from 'chart.js';
import { HistorialGraficoComponent } from './historial-grafico.component';

jest.mock('chart.js', () => ({
  Chart: Object.assign(
    jest.fn().mockImplementation((_canvas, config) => ({
      data: config.data,
      options: config.options,
      update: jest.fn(),
      destroy: jest.fn(),
    })),
    { register: jest.fn() },
  ),
}));

const dia: HistorialDiaDto = {
  fecha: '2026-10-25',
  horasSueno: 0,
  cafeinaResidual: null,
  diarioRegistrado: true,
  notificacionesAbiertas: 2,
};
const url = `${environment.apiUrl}/historial/me`;

describe('HistorialComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HistorialComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );
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

  it.each([7, 14, 30] as const)(
    'selecciona %i días con botones accesibles',
    (periodo) => {
      const { fixture, http, solicitud } = preparar();
      solicitud.flush({ dias: [] });
      const botones = fixture.nativeElement.querySelectorAll(
        'button',
      ) as NodeListOf<HTMLButtonElement>;
      botones[[7, 14, 30].indexOf(periodo)].click();
      http.expectOne(`${url}?dias=${periodo}`).flush({ dias: [dia] });
      fixture.detectChanges();
      expect(
        botones[[7, 14, 30].indexOf(periodo)].getAttribute('aria-pressed'),
      ).toBe('true');
      expect(
        fixture.nativeElement.querySelector('table caption'),
      ).not.toBeNull();
    },
  );

  it('ordena fechas civiles y muestra ceros, ausencias e indicadores', () => {
    const { fixture, solicitud } = preparar();
    solicitud.flush({
      dias: [dia, { ...dia, fecha: '2026-10-24', diarioRegistrado: false }],
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.dias()[0].fecha).toBe('2026-10-24');
    const filas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filas[1].textContent).toContain('25/10/2026');
    expect(
      Array.from(filas[1].querySelectorAll('td')).map((celda) =>
        (celda as HTMLElement).textContent?.trim(),
      ),
    ).toEqual(['0', 'Sin medición', 'Sí', '2']);
    expect(
      fixture.nativeElement.querySelectorAll('canvas[role="img"]').length,
    ).toBe(2);
    const llamadas = jest.mocked(Chart).mock.calls.slice(-2);
    llamadas.forEach((llamada) =>
      expect(llamada[1]).toMatchObject({ type: 'line' }),
    );
    expect(llamadas.map((llamada) => llamada[1].data.datasets[0].data)).toEqual(
      [
        [0, 0],
        [null, null],
      ],
    );
  });

  it('destruye ambos gráficos al cambiar de período y no crea duplicados', () => {
    const { fixture, solicitud, http } = preparar();
    jest.mocked(Chart).mockClear();
    solicitud.flush({ dias: [dia] });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(Chart).toHaveBeenCalledTimes(2);
    const anteriores = jest
      .mocked(Chart)
      .mock.results.map((resultado) => resultado.value);
    fixture.componentInstance.seleccionar(30);
    fixture.detectChanges();
    anteriores.forEach((instancia) =>
      expect(instancia.destroy).toHaveBeenCalledTimes(1),
    );
    expect(fixture.nativeElement.querySelectorAll('canvas')).toHaveLength(0);
    http
      .expectOne(`${url}?dias=30`)
      .flush({ dias: [{ ...dia, horasSueno: 8, cafeinaResidual: 35 }] });
    fixture.detectChanges();
    expect(Chart).toHaveBeenCalledTimes(4);
    expect(fixture.nativeElement.querySelectorAll('canvas')).toHaveLength(2);
    expect(
      jest
        .mocked(Chart)
        .mock.calls.slice(-2)
        .map((llamada) => llamada[1].data.datasets[0].data),
    ).toEqual([[8], [35]]);
    const actuales = jest
      .mocked(Chart)
      .mock.results.slice(-2)
      .map((resultado) => resultado.value);
    fixture.destroy();
    actuales.forEach((instancia) =>
      expect(instancia.destroy).toHaveBeenCalledTimes(1),
    );
  });

  it('muestra error y permite reintentar', () => {
    const { fixture, http, solicitud } = preparar();
    solicitud.flush(null, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]'),
    ).not.toBeNull();
    fixture.componentInstance.seleccionar(7);
    http.expectOne(`${url}?dias=7`).flush({ dias: [] });
    expect(fixture.componentInstance.error()).toBe(false);
  });

  it('no muestra el resumen de progreso cuando no hay días', () => {
    const { fixture, solicitud } = preparar();
    solicitud.flush({ dias: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.progreso-resumen')).toBeNull();
  });

  it.each([
    [
      'sin mediciones de sueño',
      [
        { ...dia, horasSueno: null },
        {
          ...dia,
          fecha: '2026-10-24',
          horasSueno: null,
          diarioRegistrado: false,
        },
      ],
      'No hay registros de sueño en este período.',
      'Registraste tu diario 1 de 2 días.',
    ],
    [
      'un solo día (singular)',
      [{ ...dia, horasSueno: 7 }],
      'Dormiste 7 h o más en 1 de 1 noche registrada.',
      'Registraste tu diario 1 de 1 día.',
    ],
    // RN06: el borde es ≥ 7 h; 6,9 h no cuenta y null no suma al denominador.
    [
      'borde de RN06 y ausencias',
      [
        { ...dia, fecha: '2026-10-22', horasSueno: 6.9 },
        { ...dia, fecha: '2026-10-23', horasSueno: 7 },
        { ...dia, fecha: '2026-10-24', horasSueno: 8, diarioRegistrado: false },
        {
          ...dia,
          fecha: '2026-10-25',
          horasSueno: null,
          diarioRegistrado: false,
        },
      ],
      'Dormiste 7 h o más en 2 de 3 noches registradas.',
      'Registraste tu diario 2 de 4 días.',
    ],
  ] as [string, HistorialDiaDto[], string, string][])(
    'resume el progreso: %s',
    (_caso, dias, sueno, diario) => {
      const { fixture, solicitud } = preparar();
      solicitud.flush({ dias });
      fixture.detectChanges();
      expect(fixture.componentInstance.progresoSueno()).toBe(sueno);
      expect(fixture.componentInstance.progresoDiario()).toBe(diario);
      const resumen = fixture.nativeElement.querySelector(
        '.progreso-resumen',
      ) as HTMLElement;
      expect(resumen.textContent).toContain(sueno);
      expect(resumen.textContent).toContain(diario);
    },
  );

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
    expect(config.data.datasets[0]).toMatchObject({
      label: 'Cafeína residual (mg)',
      data: [null],
      spanGaps: false,
    });
    expect(instancia.data.labels).toEqual(['25/10/2026']);
    fixture.componentRef.setInput('dias', [
      { ...dia, cafeinaResidual: 0 },
      { ...dia, fecha: '2026-10-26', cafeinaResidual: 42 },
    ]);
    fixture.detectChanges();
    expect(instancia.data.datasets[0].data).toEqual([0, 42]);
    expect(instancia.update).toHaveBeenCalledTimes(2);
    expect(Chart).toHaveBeenCalledTimes(1);
    fixture.destroy();
    expect(instancia.destroy).toHaveBeenCalledTimes(1);
  });

  it('vuelve a leer los colores al cambiar data-tema y deja de observar al destruirse', async () => {
    TestBed.configureTestingModule({ imports: [HistorialGraficoComponent] });
    jest.mocked(Chart).mockClear();
    const fixture = TestBed.createComponent(HistorialGraficoComponent);
    fixture.componentRef.setInput('dias', [dia]);
    fixture.detectChanges();
    const instancia = jest.mocked(Chart).mock.results[0].value;
    const canvas = fixture.nativeElement.querySelector(
      'canvas',
    ) as HTMLCanvasElement;
    canvas.style.setProperty('--color-primario', '#8e96ec');
    instancia.update.mockClear();

    document.documentElement.setAttribute('data-tema', 'oscuro');
    await Promise.resolve();
    expect(instancia.update).toHaveBeenCalledTimes(1);
    expect(instancia.data.datasets[0].borderColor).toBe('#8e96ec');
    expect(instancia.options.scales.x.ticks.color).toBe(
      getComputedStyle(canvas).color,
    );

    fixture.destroy();
    document.documentElement.setAttribute('data-tema', 'claro');
    await Promise.resolve();
    expect(instancia.update).toHaveBeenCalledTimes(1);
    document.documentElement.removeAttribute('data-tema');
  });
});
