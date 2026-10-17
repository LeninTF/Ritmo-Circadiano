import { Module } from '@nestjs/common';
import { OperacionesController } from './operaciones.controller';
import { OperacionesService } from './operaciones.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OperacionesController],
  providers: [OperacionesService],
  exports: [OperacionesService],
})
export class OperacionesModule {}

