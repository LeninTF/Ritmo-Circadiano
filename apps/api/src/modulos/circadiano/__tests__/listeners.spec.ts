import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { OperacionesService } from '../../operaciones/operaciones.service';
import type { PlanesService } from '../planes.service';
import { TurnoAsignadoListener } from '../turno-asignado.listener';
import { UsuarioEliminadoCircadianoListener } from '../usuario-eliminado.listener';

describe('TurnoAsignadoListener', () => {
  const operaciones = { obtenerTurnoPorId: jest.fn() };
  const planes = { generarParaTurno: jest.fn() };
  const listener = new TurnoAsignadoListener(
    operaciones as unknown as OperacionesService,
    planes as unknown as PlanesService,
  );

  beforeEach(() => jest.resetAllMocks());

  it('regenera el plan con el turno real de I2', async () => {
    const turno = { id: 't-1', idUsuario: 'u-1' };
    operaciones.obtenerTurnoPorId.mockResolvedValue(turno);
    await listener.regenerarPlan({ idTurno: 't-1', idUsuario: 'u-1', fecha: '2026-10-17' });
    expect(planes.generarParaTurno).toHaveBeenCalledWith(turno);
  });

  it('un fallo no rompe la asignación del turno', async () => {
    operaciones.obtenerTurnoPorId.mockRejectedValue(new NotFoundException());
    await expect(listener.regenerarPlan({ idTurno: 't-x', idUsuario: 'u-1', fecha: '2026-10-17' })).resolves.toBeUndefined();
  });
});

describe('UsuarioEliminadoCircadianoListener (DELETE /me)', () => {
  it('borra plan, cronotipo y ubicaciones del usuario en una transacción', async () => {
    const prisma = {
      $transaction: jest.fn(),
      planDiario: { deleteMany: jest.fn().mockReturnValue('plan') },
      perfilCronotipo: { deleteMany: jest.fn().mockReturnValue('perfil') },
      ubicacion: { deleteMany: jest.fn().mockReturnValue('ubicacion') },
    };
    await new UsuarioEliminadoCircadianoListener(prisma as unknown as PrismaService).borrarDatos({ idUsuario: 'u-1' });

    expect(prisma.$transaction).toHaveBeenCalledWith(['plan', 'perfil', 'ubicacion']);
    expect(prisma.ubicacion.deleteMany).toHaveBeenCalledWith({ where: { idUsuario: 'u-1' } });
  });
});
