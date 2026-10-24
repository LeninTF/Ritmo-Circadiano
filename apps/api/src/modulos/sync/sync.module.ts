import { Module } from '@nestjs/common';
import { CafeinaModule } from '../cafeina/cafeina.module';
import { IngestaSyncHandler } from '../cafeina/ingesta-sync.handler';
import { DiarioSyncHandler } from '../trabajador/diario-sync.handler';
import { TrabajadorModule } from '../trabajador/trabajador.module';
import { SyncController } from './sync.controller';
import { SyncHandlerRegistry } from './sync-handler.registry';
import { SyncOrchestratorService } from './sync-orchestrator.service';

/** POST /sync/lote (RNF03). Cada operacion nueva: importar su modulo y agregar su handler al registro. */
@Module({
  imports: [TrabajadorModule, CafeinaModule],
  controllers: [SyncController],
  providers: [
    SyncOrchestratorService,
    {
      provide: SyncHandlerRegistry,
      useFactory: (diario: DiarioSyncHandler, ingesta: IngestaSyncHandler) =>
        new SyncHandlerRegistry([diario, ingesta]),
      inject: [DiarioSyncHandler, IngestaSyncHandler],
    },
  ],
})
export class SyncModule {}
