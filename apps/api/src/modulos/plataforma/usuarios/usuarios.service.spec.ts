import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USUARIO_ELIMINADO } from '@circadiano/contracts';
import type { PrismaService } from '../../../prisma/prisma.service';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  const usuario = {
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    updateMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
  };
  const prisma = { usuario } as unknown as PrismaService;
  let eventos: EventEmitter2;
  let servicio: UsuariosService;

  beforeEach(() => {
    jest.clearAllMocks();
    eventos = new EventEmitter2();
    servicio = new UsuariosService(prisma, eventos);
  });

  it('listarTrabajadores: solo trabajadores activos y sin correo, clave ni nombre (§6)', async () => {
    await servicio.listarTrabajadores();
    const consulta = usuario.findMany.mock.calls[0][0];
    expect(consulta.where).toEqual({ rol: 'trabajador', estado: 'activo' });
    expect(Object.keys(consulta.select).sort()).toEqual(['cargo', 'codigoParticipante', 'id']);
  });

  it('borra los datos de cada slice antes que al usuario', async () => {
    const orden: string[] = [];
    eventos.on(USUARIO_ELIMINADO, async () => {
      orden.push('slice');
    });
    usuario.deleteMany.mockImplementationOnce(async () => {
      orden.push('usuario');
      return { count: 1 };
    });
    await servicio.eliminarCuenta('u1');
    expect(orden).toEqual(['slice', 'usuario']);
    expect(usuario.deleteMany).toHaveBeenCalledWith({ where: { id: 'u1' } });
  });

  it('si un slice falla, el usuario no se borra', async () => {
    eventos.on(USUARIO_ELIMINADO, async () => {
      throw new Error('bd');
    });
    await expect(servicio.eliminarCuenta('u1')).rejects.toThrow('bd');
    expect(usuario.deleteMany).not.toHaveBeenCalled();
  });

  it('actualizar un usuario inexistente da 404', async () => {
    usuario.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(servicio.actualizar('x', { estado: 'retirado' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
