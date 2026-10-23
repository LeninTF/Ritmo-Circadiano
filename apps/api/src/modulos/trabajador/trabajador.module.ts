import { Module } from '@nestjs/common';
import { DiarioController } from './diario.controller';
import { DIARIO_REPOSITORY, DiarioService } from './diario.service';
import { PrismaDiarioRepository } from './prisma-diario.repository';
import { UsuarioEliminadoTrabajadorListener } from './usuario-eliminado.listener';

@Module({
  controllers: [DiarioController],
  providers: [
    DiarioService,
    { provide: DIARIO_REPOSITORY, useClass: PrismaDiarioRepository },
    UsuarioEliminadoTrabajadorListener,
  ],
})
export class TrabajadorModule {}
