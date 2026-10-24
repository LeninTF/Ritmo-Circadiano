import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USUARIO_ELIMINADO, type UsuarioEliminadoEvento } from '@circadiano/contracts';
import { PrismaService } from '../../prisma/prisma.service';

/** DELETE /me (I1): borra plan, cronotipo y ubicaciones; evento_solar cae en cascada. */
@Injectable()
export class UsuarioEliminadoCircadianoListener {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(USUARIO_ELIMINADO, { suppressErrors: false })
  async borrarDatos({ idUsuario }: UsuarioEliminadoEvento): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.planDiario.deleteMany({ where: { idUsuario } }),
      this.prisma.perfilCronotipo.deleteMany({ where: { idUsuario } }),
      this.prisma.ubicacion.deleteMany({ where: { idUsuario } }),
    ]);
  }
}
