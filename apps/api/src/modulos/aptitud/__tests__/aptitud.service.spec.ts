import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { OperacionesService } from '../../operaciones/operaciones.service';
import { AptitudService } from '../aptitud.service';

describe('AptitudService (RF12)', () => {
  const prisma = {
    registroSueno: { findMany: jest.fn() },
    aptitudPresalida: { create: jest.fn(), findMany: jest.fn() },
    usuario: { findUnique: jest.fn() },
  };
  const operaciones = { obtenerTurnoPorId: jest.fn() };
  const servicio = new AptitudService(prisma as unknown as PrismaService, operaciones as unknown as OperacionesService);
  const ahora = new Date('2026-10-24T12:00:00Z');
  const sueno = (inicio: string, fin: string) => ({ horaAcostarse: new Date(inicio), horaDespertar: new Date(fin) });

  beforeEach(() => {
    jest.resetAllMocks();
    operaciones.obtenerTurnoPorId.mockResolvedValue({ id: 't-1', idUsuario: 'u-1' });
    prisma.aptitudPresalida.create.mockResolvedValue({});
  });

  describe('crearAptitud', () => {
    it('8 h de sueño y somnolencia baja → verde; guarda horas recortadas a 24 h y compartido=false por defecto', async () => {
      // Empieza antes de la ventana: solo cuentan 8 h dentro de [ahora-24h, ahora].
      prisma.registroSueno.findMany.mockResolvedValue([sueno('2026-10-23T10:00:00Z', '2026-10-23T20:00:00Z')]);
      const res = await servicio.crearAptitud('u-1', 't-1', { somnolencia: 2 }, ahora);

      expect(res).toEqual({ color: 'verde' });
      expect(prisma.registroSueno.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ idUsuario: 'u-1' }) }),
      );
      expect(prisma.aptitudPresalida.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ idUsuario: 'u-1', idTurno: 't-1', horasSueno24h: 8, color: 'verde', compartido: false }),
      });
    });

    it.each([
      ['6 h → ámbar', '2026-10-24T00:00:00Z', '2026-10-24T06:00:00Z', 2, 'ambar'],
      ['4 h → rojo', '2026-10-24T02:00:00Z', '2026-10-24T06:00:00Z', 1, 'rojo'],
      ['8 h pero somnolencia 4 → rojo', '2026-10-23T22:00:00Z', '2026-10-24T06:00:00Z', 4, 'rojo'],
    ])('RN09: %s', async (_caso, inicio, fin, somnolencia, color) => {
      prisma.registroSueno.findMany.mockResolvedValue([sueno(inicio, fin)]);
      await expect(servicio.crearAptitud('u-1', 't-1', { somnolencia }, ahora)).resolves.toEqual({ color });
    });

    it('sin registros de sueño → rojo', async () => {
      prisma.registroSueno.findMany.mockResolvedValue([]);
      await expect(servicio.crearAptitud('u-1', 't-1', { somnolencia: 1 }, ahora)).resolves.toEqual({ color: 'rojo' });
    });

    it('solo comparte con consentimiento explícito', async () => {
      prisma.registroSueno.findMany.mockResolvedValue([]);
      await servicio.crearAptitud('u-1', 't-1', { somnolencia: 1, compartido: true }, ahora);
      expect(prisma.aptitudPresalida.create.mock.calls[0][0].data.compartido).toBe(true);
    });

    it('turno ajeno → 403 sin guardar', async () => {
      operaciones.obtenerTurnoPorId.mockResolvedValue({ id: 't-1', idUsuario: 'otro' });
      await expect(servicio.crearAptitud('u-1', 't-1', { somnolencia: 1 }, ahora)).rejects.toThrow(ForbiddenException);
      expect(prisma.aptitudPresalida.create).not.toHaveBeenCalled();
    });

    it('turno inexistente → propaga 404 de I2', async () => {
      operaciones.obtenerTurnoPorId.mockRejectedValue(new NotFoundException());
      await expect(servicio.crearAptitud('u-1', 't-x', { somnolencia: 1 }, ahora)).rejects.toThrow(NotFoundException);
    });
  });

  describe('consultarDespacho (RN10)', () => {
    beforeEach(() => prisma.usuario.findUnique.mockResolvedValue({ id: 'u-1' }));

    it('devuelve solo el color de la última evaluación compartida de cada turno del día en Lima', async () => {
      prisma.aptitudPresalida.findMany.mockResolvedValue([
        { color: 'verde', compartido: true },
        { color: 'rojo', compartido: false },
      ]);
      const res = await servicio.consultarDespacho('P01', '2026-10-24');

      expect(res).toEqual({ evaluaciones: [{ codigo: 'P01', color: 'verde' }] });
      expect(prisma.aptitudPresalida.findMany).toHaveBeenCalledWith({
        where: {
          idUsuario: 'u-1',
          fechaHora: { gte: new Date('2026-10-24T05:00:00Z'), lt: new Date('2026-10-25T05:00:00Z') },
        },
        orderBy: { fechaHora: 'desc' },
        distinct: ['idTurno'],
        select: { color: true, compartido: true },
      });
    });

    it('participante inexistente → lista vacía', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);
      await expect(servicio.consultarDespacho('P99', '2026-10-24')).resolves.toEqual({ evaluaciones: [] });
      expect(prisma.aptitudPresalida.findMany).not.toHaveBeenCalled();
    });

    it.each([
      ['P01', '24/10/2026'],
      ['P01', ''],
      ['', '2026-10-24'],
    ])('codigo=%p fecha=%p → 400', async (codigo, fecha) => {
      await expect(servicio.consultarDespacho(codigo, fecha)).rejects.toThrow(BadRequestException);
    });
  });
});
