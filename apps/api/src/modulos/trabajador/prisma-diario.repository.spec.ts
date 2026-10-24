import { ConflictException } from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';
import { PrismaDiarioRepository } from './prisma-diario.repository';

describe('PrismaDiarioRepository', () => {
  const fila = {
    id: 'r1',
    idUsuario: 'u1',
    fecha: new Date('2026-10-21T00:00:00.000Z'),
    horaAcostarse: new Date('2026-10-20T22:00:00.000Z'),
    horaDespertar: new Date('2026-10-21T06:00:00.000Z'),
    latenciaMin: 15,
    despertares: 1,
    calidadPercibida: 4,
    fatigaPercibida: 2,
    esDiaLaboral: true,
    luzMatutinaMin: 20,
    clientId: 'c1',
    updatedAt: new Date('2026-10-21T07:00:00.000Z'),
  };
  const dto = {
    clientId: 'c1',
    horaAcostarse: '2026-10-20T22:00:00Z',
    horaDespertar: '2026-10-21T06:00:00Z',
    latenciaMin: 15,
    despertares: 1,
    calidadPercibida: 4,
    fatigaPercibida: 2,
    esDiaLaboral: true,
    luzMatutinaMin: 20,
  };
  const registroSueno = { upsert: jest.fn(), findMany: jest.fn() };
  const repositorio = new PrismaDiarioRepository({ registroSueno } as unknown as PrismaService);

  beforeEach(() => jest.resetAllMocks());

  it('hace upsert por (usuario, fecha) sin cambiar el client_id al actualizar', async () => {
    registroSueno.upsert.mockResolvedValue(fila);

    const resultado = await repositorio.upsert('u1', '2026-10-21', dto);

    const args = registroSueno.upsert.mock.calls[0][0];
    expect(args.where).toEqual({ idUsuario_fecha: { idUsuario: 'u1', fecha: fila.fecha } });
    expect(args.create).toMatchObject({ idUsuario: 'u1', clientId: 'c1', horaAcostarse: fila.horaAcostarse });
    expect(args.update).not.toHaveProperty('clientId');
    expect(resultado).toMatchObject({
      fecha: '2026-10-21',
      horaDespertar: '2026-10-21T06:00:00.000Z',
      updatedAt: '2026-10-21T07:00:00.000Z',
    });
  });

  it('client_id usado por otro registro responde 409', async () => {
    registroSueno.upsert.mockRejectedValue(Object.assign(new Error('duplicado'), { code: 'P2002' }));
    await expect(repositorio.upsert('u2', '2026-10-21', dto)).rejects.toThrow(ConflictException);
  });

  it('otros errores de BD se propagan', async () => {
    registroSueno.upsert.mockRejectedValue(new Error('caida'));
    await expect(repositorio.upsert('u1', '2026-10-21', dto)).rejects.toThrow('caida');
  });

  it('consulta solo el rango del usuario, ordenado por fecha', async () => {
    registroSueno.findMany.mockResolvedValue([fila]);
    const desde = new Date('2026-10-20T00:00:00.000Z');
    const hasta = new Date('2026-10-22T00:00:00.000Z');

    const resultado = await repositorio.consultar('u1', desde, hasta);

    expect(registroSueno.findMany).toHaveBeenCalledWith({
      where: { idUsuario: 'u1', fecha: { gte: desde, lte: hasta } },
      orderBy: { fecha: 'asc' },
    });
    expect(resultado.map((r) => r.fecha)).toEqual(['2026-10-21']);
  });
});
