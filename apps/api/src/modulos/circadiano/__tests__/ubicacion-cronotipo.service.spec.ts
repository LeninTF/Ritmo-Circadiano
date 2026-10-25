import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import { CronotipoService } from '../cronotipo.service';
import { UbicacionService } from '../ubicacion.service';

describe('UbicacionService (RF06)', () => {
  const prisma = {
    ubicacion: { create: jest.fn(), findFirst: jest.fn() },
    eventoSolar: { findMany: jest.fn(), createMany: jest.fn() },
  };
  const servicio = new UbicacionService(prisma as unknown as PrismaService);
  const ubicacionIca = { id: 'ub-1', origen: 'Ica', lat: '-14.068900', lng: '-75.722200' };

  beforeEach(() => jest.resetAllMocks());

  it('sin ubicación registrada usa la sede Ica para el plan', async () => {
    prisma.ubicacion.findFirst.mockResolvedValue(null);
    await expect(servicio.obtenerCoordenadas('u-1')).resolves.toMatchObject({ nombre: 'Ica' });
  });

  it('eventos solares sin ubicación → 404', async () => {
    prisma.ubicacion.findFirst.mockResolvedValue(null);
    await expect(servicio.listarEventos('u-1', '2026-10-17', 7)).rejects.toThrow(NotFoundException);
  });

  it('caché de 7 días: solo calcula y guarda los días que faltan', async () => {
    prisma.ubicacion.findFirst.mockResolvedValue(ubicacionIca);
    const guardado = (fecha: string) => ({
      fecha: new Date(fecha),
      amanecer: new Date(`${fecha}T10:35:00Z`),
      mediodia: new Date(`${fecha}T16:48:00Z`),
      atardecer: new Date(`${fecha}T23:01:00Z`),
    });
    prisma.eventoSolar.findMany.mockResolvedValue([guardado('2026-10-17'), guardado('2026-10-18')]);

    const eventos = await servicio.listarEventos('u-1', '2026-10-17', 7);

    expect(eventos.map((e) => e.fecha)).toEqual([
      '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
    ]);
    const nuevos = prisma.eventoSolar.createMany.mock.calls[0][0];
    expect(nuevos.skipDuplicates).toBe(true);
    expect(nuevos.data.map((e: { fecha: Date }) => e.fecha.toISOString().slice(0, 10))).toEqual([
      '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
    ]);
  });

  it('todo en caché → no escribe', async () => {
    prisma.ubicacion.findFirst.mockResolvedValue(ubicacionIca);
    prisma.eventoSolar.findMany.mockResolvedValue([
      { fecha: new Date('2026-10-17'), amanecer: new Date(), mediodia: new Date(), atardecer: new Date() },
    ]);
    await servicio.listarEventos('u-1', '2026-10-17', 1);
    expect(prisma.eventoSolar.createMany).not.toHaveBeenCalled();
  });
});

describe('CronotipoService (RF03, RN07)', () => {
  const prisma = { perfilCronotipo: { upsert: jest.fn(), findUnique: jest.fn() } };
  const servicio = new CronotipoService(prisma as unknown as PrismaService);

  beforeEach(() => jest.resetAllMocks());

  it('guarda puntaje y categoría calculados en el servidor', async () => {
    prisma.perfilCronotipo.upsert.mockImplementation(({ create }) =>
      Promise.resolve({ ...create, actualizadoEn: new Date('2026-10-24T00:00:00Z') }),
    );
    const perfil = await servicio.guardar('u-1', { p1: 5, p2: 5, p3: 4, p4: 5, p5: 4 });
    expect(perfil).toEqual({ puntaje: 23, categoria: 'matutino_definido', actualizadoEn: '2026-10-24T00:00:00.000Z' });
  });

  it('sin cuestionario: GET /cronotipo/me → 404 y el plan usa "intermedio"', async () => {
    prisma.perfilCronotipo.findUnique.mockResolvedValue(null);
    await expect(servicio.obtener('u-1')).rejects.toThrow(NotFoundException);
    await expect(servicio.obtenerCategoria('u-1')).resolves.toBe('intermedio');
  });
});
