import { Module } from '@nestjs/common';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';
import { TrabajadorModule } from '../trabajador/trabajador.module';

import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [TrabajadorModule, PrismaModule],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
