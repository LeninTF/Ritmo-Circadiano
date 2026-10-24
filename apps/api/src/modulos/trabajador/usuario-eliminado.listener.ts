import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USUARIO_ELIMINADO, type UsuarioEliminadoEvento } from '@circadiano/contracts';
import { PrismaService } from '../../prisma/prisma.service';

/** DELETE /me (I1): borra el diario de sueno y las evaluaciones de aptitud del usuario. */
@Injectable()
export class UsuarioEliminadoTrabajadorListener {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(USUARIO_ELIMINADO, { suppressErrors: false })
  async borrarDatos({ idUsuario }: UsuarioEliminadoEvento): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.registroSueno.deleteMany({ where: { idUsuario } }),
      this.prisma.aptitudPresalida.deleteMany({ where: { idUsuario } }),
    ]);
  }
}
