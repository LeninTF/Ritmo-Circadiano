import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USUARIO_ELIMINADO, type UsuarioEliminadoEvento } from '@circadiano/contracts';
import { PrismaService } from '../../prisma/prisma.service';

/** DELETE /me (I1): borra los turnos del usuario y sus excesos auditados. */
@Injectable()
export class UsuarioEliminadoOperacionesListener {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(USUARIO_ELIMINADO, { suppressErrors: false })
  async borrarDatos({ idUsuario }: UsuarioEliminadoEvento): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.excesoJornadaAuditoria.deleteMany({ where: { idUsuario } }),
      this.prisma.turnoLaboral.deleteMany({ where: { idUsuario } }),
    ]);
  }
}
