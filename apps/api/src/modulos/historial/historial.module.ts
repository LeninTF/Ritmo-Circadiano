import { Module } from '@nestjs/common';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';
import { TrabajadorModule } from '../trabajador/trabajador.module';

import { CafeinaModule } from '../cafeina/cafeina.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [TrabajadorModule, CafeinaModule, NotificacionesModule],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
