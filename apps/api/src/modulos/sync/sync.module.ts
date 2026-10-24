import { Module } from '@nestjs/common';
import { DiarioSyncHandler } from '../trabajador/diario-sync.handler';
import { TrabajadorModule } from '../trabajador/trabajador.module';
import { SyncController } from './sync.controller';
import { SyncHandlerRegistry } from './sync-handler.registry';
import { SyncOrchestratorService } from './sync-orchestrator.service';

/** POST /sync/lote (RNF03). Cada operacion nueva: importar su modulo y agregar su handler al registro. */
@Module({
  imports: [TrabajadorModule],
  controllers: [SyncController],
  providers: [
    SyncOrchestratorService,
    {
      provide: SyncHandlerRegistry,
      useFactory: (diario: DiarioSyncHandler) => new SyncHandlerRegistry([diario]),
      inject: [DiarioSyncHandler],
    },
  ],
})
export class SyncModule {}
