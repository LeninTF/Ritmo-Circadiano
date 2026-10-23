import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import { ParametrosService } from './parametros.service';

describe('ParametrosService', () => {
  const parametroSistema = { findMany: jest.fn(), upsert: jest.fn() };
  const servicio = new ParametrosService({ parametroSistema } as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('lista los editables con el valor guardado o el de defecto', async () => {
    parametroSistema.findMany.mockResolvedValueOnce([{ clave: 'otro', valor: 'x' }]);
    const lista = await servicio.listar();
    expect(lista).toEqual([expect.objectContaining({ clave: 'umbral_cafeina_mg', valor: '50' })]);
  });

  it('guarda un valor valido normalizado', async () => {
    const r = await servicio.actualizar('umbral_cafeina_mg', ' 40.0 ');
    expect(r.valor).toBe('40');
    expect(parametroSistema.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { valor: '40' } }),
    );
  });

  it.each(['', 'abc', '-1', '401', 'Infinity'])('rechaza %p', async (valor) => {
    await expect(servicio.actualizar('umbral_cafeina_mg', valor)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('una clave no editable da 404', async () => {
    await expect(servicio.actualizar('jwt_secret', '1')).rejects.toBeInstanceOf(NotFoundException);
    expect(parametroSistema.upsert).not.toHaveBeenCalled();
  });
});
