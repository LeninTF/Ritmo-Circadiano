import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USUARIO_ELIMINADO,
  type ActualizarUsuarioAdminDto,
  type Paginado,
  type TrabajadorResumenDto,
  type UsuarioAdminDto,
  type UsuarioEliminadoEvento,
} from '@circadiano/contracts';
import { PrismaService } from '../../../prisma/prisma.service';

const CAMPOS_ADMIN = {
  id: true,
  codigoParticipante: true,
  rol: true,
  estado: true,
  idArea: true,
  cargo: true,
} as const;

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventos: EventEmitter2,
  ) {}

  /**
   * Ley 29733: cada slice borra primero sus filas (listeners de UsuarioEliminado);
   * si alguno falla, el usuario no se borra y la peticion puede repetirse.
   */
  async eliminarCuenta(idUsuario: string): Promise<void> {
    await this.eventos.emitAsync(USUARIO_ELIMINADO, { idUsuario } satisfies UsuarioEliminadoEvento);
    await this.prisma.usuario.deleteMany({ where: { id: idUsuario } });
  }

  async listar(pagina: number, tamanoPagina: number): Promise<Paginado<UsuarioAdminDto>> {
    const [datos, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        select: CAMPOS_ADMIN,
        orderBy: { codigoParticipante: 'asc' },
        skip: (pagina - 1) * tamanoPagina,
        take: tamanoPagina,
      }),
      this.prisma.usuario.count(),
    ]);
    return { datos, total, pagina, tamanoPagina };
  }

  /** Para que I2 asigne turnos: solo trabajadores activos y sin datos personales (§6). */
  listarTrabajadores(): Promise<TrabajadorResumenDto[]> {
    return this.prisma.usuario.findMany({
      where: { rol: 'trabajador', estado: 'activo' },
      select: { id: true, codigoParticipante: true, cargo: true },
      orderBy: { codigoParticipante: 'asc' },
    });
  }

  async actualizar(id: string, cambios: ActualizarUsuarioAdminDto): Promise<UsuarioAdminDto> {
    const { count } = await this.prisma.usuario.updateMany({ where: { id }, data: cambios });
    if (count === 0) throw new NotFoundException('Usuario no encontrado');
    return this.prisma.usuario.findUniqueOrThrow({ where: { id }, select: CAMPOS_ADMIN });
  }
}
