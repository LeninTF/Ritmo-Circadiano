import { AreasService } from './areas.service';
import type { PrismaService } from '../../../prisma/prisma.service';

describe('AreasService', () => {
  it('lista solo id y nombre, ordenadas por nombre', async () => {
    const buscar = jest.fn().mockResolvedValue([{ id: 'a-1', nombre: 'Gerencia General' }]);
    const servicio = new AreasService({ area: { findMany: buscar } } as unknown as PrismaService);
    expect(await servicio.listar()).toEqual([{ id: 'a-1', nombre: 'Gerencia General' }]);
    expect(buscar).toHaveBeenCalledWith({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  });
});
