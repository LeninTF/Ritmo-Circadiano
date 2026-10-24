import { BadRequestException, ConflictException } from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';
import type { ParametrosService } from '../plataforma/parametros/parametros.service';
import { CafeinaService } from './cafeina.service';

describe('CafeinaService · resumen y cafeína activa (RF09)', () => {
  const prisma = {
    ingestaCafeina: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
    bebida: { findUnique: jest.fn() },
  };
  const parametros = { listar: jest.fn() };
  const servicio = new CafeinaService(
    prisma as unknown as PrismaService,
    parametros as unknown as ParametrosService,
  );
  // 15:00 en Lima del 24 de octubre.
  const ahora = new Date('2026-10-24T20:00:00.000Z');
  const ingesta = (mg: number, iso: string) => ({ cafeina_mg: mg, fecha_hora: new Date(iso) });

  beforeEach(() => {
    jest.resetAllMocks();
    parametros.listar.mockResolvedValue([]);
  });

  it('devuelve 7 días con ceros, el total de hoy y la cafeína activa estimada', async () => {
    prisma.ingestaCafeina.findMany.mockResolvedValue([
      ingesta(95, '2026-10-24T10:00:00.000Z'), // hace 10 h
      ingesta(63, '2026-10-24T20:00:00.000Z'), // ahora
      ingesta(190, '2026-10-21T15:00:00.000Z'),
    ]);

    const resumen = await servicio.obtenerResumen('u-1', 7, ahora);

    expect(resumen.zonaHoraria).toBe('America/Lima');
    expect(resumen.dias).toHaveLength(7);
    expect(resumen.dias[0]).toEqual({ fecha: '2026-10-18', totalMg: 0, conteo: 0 });
    expect(resumen.dias[3]).toEqual({ fecha: '2026-10-21', totalMg: 190, conteo: 1 });
    expect(resumen.hoy).toEqual({ fecha: '2026-10-24', totalMg: 158, conteo: 2 });
    expect(resumen.cafeinaActiva).toMatchObject({
      mg: 87,
      calculadoEn: '2026-10-24T20:00:00.000Z',
      semividaH: 5,
      umbralMg: 50,
      esEstimacion: true,
    });
    const bajaEnS = (Date.parse(resumen.cafeinaActiva.horaNivelBajo ?? '') - ahora.getTime()) / 1000;
    expect(Math.abs(bajaEnS - (3 * 3600 + 58 * 60 + 29))).toBeLessThan(60);
  });

  it('solo consulta ingestas del usuario del token dentro del rango', async () => {
    prisma.ingestaCafeina.findMany.mockResolvedValue([]);

    await servicio.obtenerResumen('u-1', 7, ahora);

    const { where } = prisma.ingestaCafeina.findMany.mock.calls[0][0];
    expect(where.id_usuario).toBe('u-1');
    expect(where.fecha_hora.lte).toEqual(ahora);
    expect(where.fecha_hora.gte.getTime()).toBe(ahora.getTime() - 8 * 24 * 3_600_000);
  });

  it('sin consumos: nivel bajo, sin hora de bajada', async () => {
    prisma.ingestaCafeina.findMany.mockResolvedValue([]);

    const { cafeinaActiva, hoy } = await servicio.obtenerResumen('u-1', 7, ahora);

    expect(hoy).toEqual({ fecha: '2026-10-24', totalMg: 0, conteo: 0 });
    expect(cafeinaActiva.mg).toBe(0);
    expect(cafeinaActiva.horaNivelBajo).toBeNull();
  });

  it('usa el umbral de parametro_sistema (RN02)', async () => {
    parametros.listar.mockResolvedValue([{ clave: 'umbral_cafeina_mg', valor: '100' }]);
    prisma.ingestaCafeina.findMany.mockResolvedValue([ingesta(200, '2026-10-24T20:00:00.000Z')]);

    const { cafeinaActiva } = await servicio.obtenerResumen('u-1', 7, ahora);

    expect(cafeinaActiva.umbralMg).toBe(100);
    expect(cafeinaActiva.horaNivelBajo).toBe('2026-10-25T01:00:00.000Z');
  });

  it('listarIngestas corta el día en hora de Lima, no en UTC', async () => {
    prisma.ingestaCafeina.findMany.mockResolvedValue([]);

    await servicio.listarIngestas('u-1', '2026-10-24');

    const { fecha_hora } = prisma.ingestaCafeina.findMany.mock.calls[0][0].where;
    expect(fecha_hora.gte.toISOString()).toBe('2026-10-24T05:00:00.000Z');
    expect(fecha_hora.lte.toISOString()).toBe('2026-10-25T04:59:59.999Z');
  });

  describe('registrarIngesta (HU-03)', () => {
    const base = {
      id_usuario: 'u-1',
      client_id: '3f1c2b9e-8a4d-4c1e-9b7a-2d5e6f708192',
      fecha_hora: new Date(Date.now() - 3_600_000).toISOString(),
    };

    beforeEach(() => {
      prisma.ingestaCafeina.findUnique.mockResolvedValue(null);
      prisma.ingestaCafeina.findMany.mockResolvedValue([]);
      prisma.ingestaCafeina.create.mockImplementation(({ data }) => Promise.resolve({ id_ingesta: 1, ...data }));
    });

    it('bebida del catálogo: mg = mg por porción × porciones y descarta los mg enviados', async () => {
      prisma.bebida.findUnique.mockResolvedValue({ id_bebida: 1, cafeina_mg: 95 });

      const res = await servicio.registrarIngesta({ ...base, id_bebida: 1, porciones: 2, cafeina_mg: 5 });

      expect(res.cafeina_mg).toBe(190);
    });

    it('sin bebida usa los mg indicados', async () => {
      const res = await servicio.registrarIngesta({ ...base, cafeina_mg: 150 });
      expect(res.cafeina_mg).toBe(150);
    });

    it.each([
      ['bebida inexistente', { id_bebida: 99 }],
      ['ni bebida ni mg', {}],
      ['más de 5 min en el futuro', { cafeina_mg: 50, fecha_hora: new Date(Date.now() + 10 * 60_000).toISOString() }],
      ['más de 7 días atrás', { cafeina_mg: 50, fecha_hora: new Date(Date.now() - 8 * 86_400_000).toISOString() }],
    ])('rechaza con 400: %s', async (_caso, extra) => {
      prisma.bebida.findUnique.mockResolvedValue(null);
      await expect(servicio.registrarIngesta({ ...base, ...extra })).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.ingestaCafeina.create).not.toHaveBeenCalled();
    });

    it('idempotente: mismo client_id del mismo usuario devuelve lo guardado sin crear otro', async () => {
      prisma.ingestaCafeina.findUnique.mockResolvedValue({
        id_ingesta: 7, id_usuario: 'u-1', id_bebida: 1, cafeina_mg: 95,
        fecha_hora: new Date(base.fecha_hora), residual_estimado_mg: 95, client_id: base.client_id,
      });

      const res = await servicio.registrarIngesta({ ...base, id_bebida: 1 });

      expect(res.id_ingesta).toBe(7);
      expect(prisma.ingestaCafeina.create).not.toHaveBeenCalled();
    });

    it('client_id de otro usuario: 409', async () => {
      prisma.ingestaCafeina.findUnique.mockResolvedValue({ id_usuario: 'otro' });
      await expect(servicio.registrarIngesta({ ...base, cafeina_mg: 50 })).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
