import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import type { BebidaDto, CafeinaActivaDto, PlanDiarioDto, ResumenCafeinaDto } from '@circadiano/contracts';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { OutboxService } from '../../core/offline/outbox.service';
import { environment } from '../../../environments/environment';
import {
  CafeinaService,
  aFechaReciente,
  errorRegistro,
  fechaLima,
  horaLima,
  mensajeCafeinaActiva,
  resumenLocal,
  totalMg,
  type ConsumoItem,
  type RegistroCafeina,
} from './cafeina.service';

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
  const store = {
    addIngesta: jest.fn(),
    getMyIngestas: jest.fn(),
    getPendingOutbox: jest.fn(),
    removeIngestaPorClientId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    outbox.enqueue.mockResolvedValue('cid-1');
    outbox.sync.mockResolvedValue(undefined);
    store.addIngesta.mockResolvedValue(1);
    store.getMyIngestas.mockResolvedValue([]);
    store.getPendingOutbox.mockResolvedValue([]);
    store.removeIngestaPorClientId.mockResolvedValue(undefined);
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

  describe('Mi consumo (HU-04, HU-05)', () => {
    const API = environment.apiUrl;
    // 15:00 en Lima del 24 de octubre.
    const ahoraLima = new Date('2026-10-24T20:00:00.000Z');
    const esperar = () => new Promise((r) => setTimeout(r, 0));
    const resumen = resumenLocal([], ahoraLima);
    const local = (clientId: string, fechaHora: string, cafeinaMg = 95) => ({
      fecha: fechaHora,
      data: { clientId, cafeinaMg, nombre: 'Café pasado' },
    });

    it('con señal: resumen y registros del servidor, más los de hoy aún en la cola', async () => {
      store.getMyIngestas.mockResolvedValue([
        local('enviado', '2026-10-24T13:00:00.000Z'),
        local('en-cola', '2026-10-24T19:00:00.000Z', 63),
        local('de-ayer', '2026-10-23T15:00:00.000Z'),
      ]);
      store.getPendingOutbox.mockResolvedValue([
        { clientId: 'en-cola', operation: 'ingesta' },
        { clientId: 'de-ayer', operation: 'ingesta' },
        { clientId: 'otro', operation: 'diario' },
      ]);

      const consumo = servicio.obtenerMiConsumo(ahoraLima);
      await esperar();
      http.expectOne(`${API}/cafeina/resumen`).flush(resumen);
      await esperar();
      http.expectOne(`${API}/cafeina?fecha=2026-10-24`).flush([
        { id_ingesta: 7, id_usuario: 'u', id_bebida: 1, cafeina_mg: 95, fecha_hora: '2026-10-24T13:00:00.000Z', residual_estimado_mg: 95, client_id: 'enviado' },
      ]);
      http.expectOne(`${API}/bebidas`).flush([CAFE]);

      const { items, sinSenal } = await consumo;
      expect(sinSenal).toBe(false);
      expect(items).toEqual<ConsumoItem[]>([
        { clientId: 'en-cola', idIngesta: null, nombre: 'Café pasado', cafeinaMg: 63, fechaHora: '2026-10-24T19:00:00.000Z', pendiente: true },
        { clientId: 'enviado', idIngesta: 7, nombre: 'Café pasado', cafeinaMg: 95, fechaHora: '2026-10-24T13:00:00.000Z', pendiente: false },
      ]);
    });

    it('sin señal: calcula en el teléfono con el mismo dominio que el servidor', async () => {
      store.getMyIngestas.mockResolvedValue([
        local('a', '2026-10-24T10:00:00.000Z', 95),
        local('b', '2026-10-24T20:00:00.000Z', 63),
      ]);
      store.getPendingOutbox.mockResolvedValue([{ clientId: 'b', operation: 'ingesta' }]);

      const consumo = servicio.obtenerMiConsumo(ahoraLima);
      await esperar();
      http.expectOne(`${API}/cafeina/resumen`).error(new ProgressEvent('error'), { status: 0 });

      const { resumen: local7, items, sinSenal } = await consumo;
      expect(sinSenal).toBe(true);
      expect(local7.hoy).toEqual({ fecha: '2026-10-24', totalMg: 158, conteo: 2 });
      expect(local7.cafeinaActiva.mg).toBe(87);
      expect(items.map((i) => [i.clientId, i.pendiente])).toEqual([['b', true], ['a', false]]);
    });

    it('un error del servidor que no es falta de señal se propaga', async () => {
      const consumo = servicio.obtenerMiConsumo(ahoraLima);
      await esperar();
      http.expectOne(`${API}/cafeina/resumen`).flush({}, { status: 500, statusText: 'Error' });
      await expect(consumo).rejects.toBeTruthy();
    });

    it('eliminar borra en el servidor y la copia local', async () => {
      const item: ConsumoItem = { clientId: 'c', idIngesta: 7, nombre: 'Café', cafeinaMg: 95, fechaHora: '', pendiente: false };
      const borrado = servicio.eliminar(item);
      http.expectOne({ method: 'DELETE', url: `${API}/cafeina/7` }).flush(null);
      await borrado;
      expect(store.removeIngestaPorClientId).toHaveBeenCalledWith('c');
    });

    it('no intenta eliminar lo que aún no está en el servidor', async () => {
      const item: ConsumoItem = { clientId: 'c', idIngesta: null, nombre: 'Café', cafeinaMg: 95, fechaHora: '', pendiente: true };
      await expect(servicio.eliminar(item)).rejects.toThrow();
    });
  });
});

describe('texto de la tarjeta de cafeína activa (SPEC §7.1)', () => {
  const activa = (mg: number, horaNivelBajo: string | null): CafeinaActivaDto => ({
    mg, horaNivelBajo, calculadoEn: '2026-10-24T20:00:00.000Z', semividaH: 5, umbralMg: 50, esEstimacion: true,
  });
  const plan = (horaCorteCafeina: string | null) =>
    ({ inicioSueno: '2026-10-25T01:00:00.000Z', horaCorteCafeina }) as PlanDiarioDto;

  it('fechas y horas siempre en Lima', () => {
    expect(fechaLima('2026-10-24T04:30:00.000Z')).toBe('2026-10-23');
    expect(horaLima('2026-10-24T23:58:29.000Z')).toBe('18:58');
  });

  it('sin plan: cuánto queda y cuándo baja a nivel bajo', () => {
    expect(mensajeCafeinaActiva(activa(87, '2026-10-24T23:58:29.000Z'), null))
      .toBe('Tienes ~87 mg de cafeína activa. Bajará a nivel bajo cerca de las 18:58.');
  });

  it('con plan: la hora de dormir y el corte del plan', () => {
    expect(mensajeCafeinaActiva(activa(120, '2026-10-25T00:00:00.000Z'), plan('2026-10-24T19:00:00.000Z')))
      .toBe('Te quedan ~120 mg de cafeína activa. Si duermes a las 20:00, evita más café después de las 14:00.');
    expect(mensajeCafeinaActiva(activa(120, '2026-10-25T00:00:00.000Z'), plan(null)))
      .toBe('Te quedan ~120 mg de cafeína activa. Si duermes a las 20:00, evita más café por hoy.');
  });

  it('en nivel bajo lo dice así, con o sin plan', () => {
    expect(mensajeCafeinaActiva(activa(30, null), null)).toBe('Tu cafeína activa está en nivel bajo.');
    expect(mensajeCafeinaActiva(activa(30, null), plan('2026-10-24T19:00:00.000Z')))
      .toBe('Tu cafeína activa está en nivel bajo. Si duermes a las 20:00, evita más café después de las 14:00.');
  });

  it('resumenLocal: 7 días, el último es hoy y marca la estimación', () => {
    const r: ResumenCafeinaDto = resumenLocal([], new Date('2026-10-24T20:00:00.000Z'));
    expect(r.dias).toHaveLength(7);
    expect(r.hoy.fecha).toBe('2026-10-24');
    expect(r.cafeinaActiva).toMatchObject({ mg: 0, horaNivelBajo: null, esEstimacion: true });
  });
});
