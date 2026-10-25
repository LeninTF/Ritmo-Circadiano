import { BadRequestException, ConflictException } from '@nestjs/common';
import type { CafeinaService } from './cafeina.service';
import { IngestaSyncHandler } from './ingesta-sync.handler';

describe('IngestaSyncHandler (RNF03)', () => {
  const cafeina = { registrarIngesta: jest.fn() };
  const handler = new IngestaSyncHandler(cafeina as unknown as CafeinaService);
  const operacion = (payload: Record<string, unknown>) => ({
    clientId: '3f1c2b9e-8a4d-4c1e-9b7a-2d5e6f708192',
    createdAt: '2026-10-24T13:30:00.000Z',
    operation: 'ingesta',
    payload,
  });
  const valido = { id_bebida: 1, porciones: 2, fecha_hora: '2026-10-24T13:30:00.000Z' };

  beforeEach(() => jest.resetAllMocks());

  it('registra con el usuario de la identidad y el client_id del sobre', async () => {
    cafeina.registrarIngesta.mockResolvedValue({});

    const res = await handler.handle(operacion({ ...valido, client_id: 'otro-id' }), { userId: 'u-1' });

    expect(res).toEqual({ status: 'confirmed' });
    expect(cafeina.registrarIngesta).toHaveBeenCalledWith(expect.objectContaining({
      id_usuario: 'u-1',
      client_id: '3f1c2b9e-8a4d-4c1e-9b7a-2d5e6f708192',
      id_bebida: 1,
      porciones: 2,
    }));
  });

  it.each([
    ['payload inválido', { ...valido, porciones: 9 }],
    ['campo no permitido', { ...valido, id_usuario: 'otro' }],
  ])('rechaza sin llamar al servicio: %s', async (_caso, payload) => {
    const res = await handler.handle(operacion(payload), { userId: 'u-1' });
    expect(res.status).toBe('rejected');
    expect(cafeina.registrarIngesta).not.toHaveBeenCalled();
  });

  it.each([
    [new ConflictException(), 'SYNC_CLIENT_ID_COLLISION'],
    [new BadRequestException(), 'SYNC_INVALID_PAYLOAD'],
  ])('traduce errores del servicio a rechazos (%s)', async (error, code) => {
    cafeina.registrarIngesta.mockRejectedValue(error);
    const res = await handler.handle(operacion(valido), { userId: 'u-1' });
    expect(res).toMatchObject({ status: 'rejected', code });
  });

  it('propaga errores inesperados para que el lote los reintente', async () => {
    cafeina.registrarIngesta.mockRejectedValue(new Error('BD caida'));
    await expect(handler.handle(operacion(valido), { userId: 'u-1' })).rejects.toThrow('BD caida');
  });
});
