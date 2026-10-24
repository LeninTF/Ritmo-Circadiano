import { Module } from '@nestjs/common';
import { DiarioController } from './diario.controller';
import { DiarioSyncHandler } from './diario-sync.handler';
import { DIARIO_REPOSITORY, DiarioService } from './diario.service';
import { PrismaDiarioRepository } from './prisma-diario.repository';
import { UsuarioEliminadoTrabajadorListener } from './usuario-eliminado.listener';

@Module({
  controllers: [DiarioController],
  providers: [
    DiarioService,
    DiarioSyncHandler,
    { provide: DIARIO_REPOSITORY, useClass: PrismaDiarioRepository },
    UsuarioEliminadoTrabajadorListener,
  ],
  exports: [DiarioSyncHandler],
})
export class TrabajadorModule {}
