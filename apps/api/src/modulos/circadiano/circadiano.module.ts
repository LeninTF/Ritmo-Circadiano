import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CircadianoController } from './controllers/circadiano.controller';
import { CircadianoService } from './services/circadiano.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OnTurnoAsignadoHandler } from './listeners/on-turno-asignado.handler';

@Module({
  imports: [PrismaModule, EventEmitterModule],
  controllers: [CircadianoController],
  providers: [CircadianoService, OnTurnoAsignadoHandler],
  exports: [CircadianoService],
})
export class CircadianoModule {}

