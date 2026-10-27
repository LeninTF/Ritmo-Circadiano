import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { DiarioController } from './diario.controller';
import { DiarioSyncHandler } from './diario-sync.handler';
import { DIARIO_REPOSITORY, DiarioService } from './diario.service';
import { PrismaDiarioRepository } from './prisma-diario.repository';
import { TurnoAsignadoNotificacionListener } from './turno-asignado-notificacion.listener';
import { UsuarioEliminadoTrabajadorListener } from './usuario-eliminado.listener';

@Module({
  imports: [NotificacionesModule],
  controllers: [DiarioController],
  providers: [
    DiarioService,
    DiarioSyncHandler,
    { provide: DIARIO_REPOSITORY, useClass: PrismaDiarioRepository },
    UsuarioEliminadoTrabajadorListener,
    TurnoAsignadoNotificacionListener,
  ],
  exports: [DiarioSyncHandler, DiarioService],
})
export class TrabajadorModule {}
