import { BadRequestException, ConflictException } from '@nestjs/common';
import type { SyncOperacionDto } from '@circadiano/contracts';
import { DiarioSyncHandler } from './diario-sync.handler';
import type { DiarioService } from './diario.service';

describe('DiarioSyncHandler (RNF03)', () => {
  const upsertDiario = jest.fn();
  const handler = new DiarioSyncHandler({ upsertDiario } as unknown as DiarioService);
  const clientId = '123e4567-e89b-12d3-a456-426614174000';
  const payload = {
    fecha: '2026-10-21',
    horaAcostarse: '2026-10-20T22:00:00Z',
    horaDespertar: '2026-10-21T06:00:00Z',
    latenciaMin: 10,
    despertares: 0,
    calidadPercibida: 4,
    fatigaPercibida: 2,
    esDiaLaboral: true,
    luzMatutinaMin: 30,
  };
  const op = (p: Record<string, unknown> = payload): SyncOperacionDto => ({
    clientId,
    createdAt: '2026-10-21T07:00:00.000Z',
    operation: 'diario',
    payload: p,
  });
  const identidad = { userId: 'yo' };

  beforeEach(() => upsertDiario.mockReset().mockResolvedValue({}));

  it('confirma y hace upsert con el usuario del token y el client_id del sobre', async () => {
    await expect(handler.handle(op(), identidad)).resolves.toEqual({ status: 'confirmed' });
    const { fecha, ...datos } = payload;
    expect(upsertDiario).toHaveBeenCalledWith('yo', fecha, expect.objectContaining({ ...datos, clientId }));
  });

  it.each([
    ['sin fecha', { ...payload, fecha: undefined }],
    ['calidad fuera de rango', { ...payload, calidadPercibida: 9 }],
    ['hora no ISO', { ...payload, horaAcostarse: '22h' }],
    ['campo extra', { ...payload, idUsuario: 'otro' }],
  ])('rechaza payload invalido: %s', async (_caso, p) => {
    await expect(handler.handle(op(p), identidad)).resolves.toMatchObject({
      status: 'rejected',
      code: 'SYNC_INVALID_PAYLOAD',
    });
    expect(upsertDiario).not.toHaveBeenCalled();
  });

  it('fecha inexistente (400 del servicio) se rechaza', async () => {
    upsertDiario.mockRejectedValue(new BadRequestException());
    await expect(handler.handle(op(), identidad)).resolves.toMatchObject({ code: 'SYNC_INVALID_PAYLOAD' });
  });

  it('client_id de otro registro (409) se rechaza como colision', async () => {
    upsertDiario.mockRejectedValue(new ConflictException());
    await expect(handler.handle(op(), identidad)).resolves.toMatchObject({
      status: 'rejected',
      code: 'SYNC_CLIENT_ID_COLLISION',
    });
  });

  it('un error de BD se propaga para que el orquestador lo marque reintentable', async () => {
    upsertDiario.mockRejectedValue(new Error('bd caida'));
    await expect(handler.handle(op(), identidad)).rejects.toThrow('bd caida');
  });
});
