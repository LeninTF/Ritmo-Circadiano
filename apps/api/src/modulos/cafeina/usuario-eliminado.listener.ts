import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USUARIO_ELIMINADO, type UsuarioEliminadoEvento } from '@circadiano/contracts';
import { PrismaService } from '../../prisma/prisma.service';

/** DELETE /me (I1): borra ingestas, notificaciones y suscripciones push del usuario. */
@Injectable()
export class UsuarioEliminadoCafeinaListener {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(USUARIO_ELIMINADO, { suppressErrors: false })
  async borrarDatos({ idUsuario }: UsuarioEliminadoEvento): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.ingestaCafeina.deleteMany({ where: { id_usuario: idUsuario } }),
      this.prisma.notificacion.deleteMany({ where: { id_usuario: idUsuario } }),
      this.prisma.suscripcionPush.deleteMany({ where: { id_usuario: idUsuario } }),
    ]);
  }
}
