import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import type { BebidaDto } from '@circadiano/contracts';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { OutboxService } from '../../core/offline/outbox.service';
import { environment } from '../../../environments/environment';
import { CafeinaService, aFechaReciente, errorRegistro, totalMg, type RegistroCafeina } from './cafeina.service';

const CAFE: BebidaDto = { id_bebida: 1, nombre: 'Café pasado', cafeina_mg: 95, volumen_ml: 240 };
// 15:00 del 24 de octubre en la zona del dispositivo.
const AHORA = new Date(2026, 9, 24, 15, 0);
const registro = (cambios: Partial<RegistroCafeina> = {}): RegistroCafeina => ({
  bebida: CAFE, porciones: 1, cafeinaMg: null, hora: '14:30', ...cambios,
});

describe('reglas del formulario de cafeína (HU-03)', () => {
  it('total en vivo: mg por porción × porciones, o los mg indicados en «Otro»', () => {
    expect(totalMg(registro({ porciones: 2 }))).toBe(190);
    expect(totalMg(registro({ bebida: null, cafeinaMg: 150 }))).toBe(150);
    expect(totalMg(registro({ bebida: null }))).toBe(0);
  });

  it('usa la última vez que fue esa hora: hoy, o ayer si hoy todavía no llega', () => {
    expect(aFechaReciente('07:05', AHORA)).toEqual(new Date(2026, 9, 24, 7, 5));
    expect(aFechaReciente('15:05', AHORA)).toEqual(new Date(2026, 9, 24, 15, 5));
    expect(aFechaReciente('15:10', AHORA)).toEqual(new Date(2026, 9, 23, 15, 10));
    // A las 00:05, «23:50» es el café de anoche (turno nocturno).
    expect(aFechaReciente('23:50', new Date(2026, 9, 25, 0, 5))).toEqual(new Date(2026, 9, 24, 23, 50));
  });

  it.each<[string, Partial<RegistroCafeina>, string | null]>([
    ['bebida del catálogo válida', {}, null],
    ['«Otro» sin mg', { bebida: null }, 'Indica los mg (entre 1 y 1000).'],
    ['«Otro» con 0 mg', { bebida: null, cafeinaMg: 0 }, 'Indica los mg (entre 1 y 1000).'],
    ['«Otro» con 1001 mg', { bebida: null, cafeinaMg: 1001 }, 'Indica los mg (entre 1 y 1000).'],
    ['«Otro» con decimales', { bebida: null, cafeinaMg: 12.5 }, 'Indica los mg (entre 1 y 1000).'],
    ['sin hora', { hora: '' }, 'Indica la hora.'],
  ])('%s', (_caso, cambios, esperado) => {
    expect(errorRegistro(registro(cambios))).toBe(esperado);
  });
});

describe('CafeinaService', () => {
  let servicio: CafeinaService;
  let http: HttpTestingController;
  const outbox = { enqueue: jest.fn(), sync: jest.fn() };
  const store = { addIngesta: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    outbox.enqueue.mockResolvedValue('cid-1');
    outbox.sync.mockResolvedValue(undefined);
    store.addIngesta.mockResolvedValue(1);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OutboxService, useValue: outbox },
        { provide: OfflineStoreService, useValue: store },
      ],
    });
    servicio = TestBed.inject(CafeinaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('pide el catálogo a la API y guarda una copia para usarla sin señal', async () => {
    const enLinea = servicio.obtenerBebidas();
    http.expectOne(`${environment.apiUrl}/bebidas`).flush([CAFE]);
    expect(await enLinea).toEqual([CAFE]);

    const sinRed = servicio.obtenerBebidas();
    http.expectOne(`${environment.apiUrl}/bebidas`).error(new ProgressEvent('error'), { status: 0 });
    expect(await sinRed).toEqual([CAFE]);
  });

  it('sin red y sin copia devuelve un catálogo vacío', async () => {
    const sinRed = servicio.obtenerBebidas();
    http.expectOne(`${environment.apiUrl}/bebidas`).error(new ProgressEvent('error'), { status: 0 });
    expect(await sinRed).toEqual([]);
  });

  it('bebida del catálogo: encola id_bebida y porciones (sin mg ni client_id) y sincroniza', async () => {
    const id = await servicio.registrar(registro({ porciones: 2 }), AHORA);

    const fechaHora = new Date(2026, 9, 24, 14, 30).toISOString();
    expect(id).toBe('cid-1');
    expect(outbox.enqueue).toHaveBeenCalledWith({
      operation: 'ingesta',
      payload: { id_bebida: 1, porciones: 2, fecha_hora: fechaHora },
    });
    expect(store.addIngesta).toHaveBeenCalledWith({
      fecha: fechaHora,
      data: { clientId: 'cid-1', cafeinaMg: 190, nombre: 'Café pasado' },
    });
    expect(outbox.sync).toHaveBeenCalled();
  });

  it('si falla el store auxiliar no lanza: ya está en la cola y reintentar la duplicaría', async () => {
    store.addIngesta.mockRejectedValue(new Error('cuota llena'));

    await expect(servicio.registrar(registro(), AHORA)).resolves.toBe('cid-1');
    expect(outbox.enqueue).toHaveBeenCalledTimes(1);
  });

  it('«Otro»: encola solo los mg indicados', async () => {
    await servicio.registrar(registro({ bebida: null, cafeinaMg: 150 }), AHORA);

    expect(outbox.enqueue.mock.calls[0][0].payload).toEqual({
      cafeina_mg: 150,
      fecha_hora: new Date(2026, 9, 24, 14, 30).toISOString(),
    });
  });
});
